from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
import csv
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job
from users.models import Notification
from django.core.mail import send_mail

from ai_engine.gemini_engine import process_application



# -----------------------------
# Application Views
# -----------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_applications(request):
    if request.user.role == 'candidate':
        return Response({'error': 'Only HRs and admins can view applications.'}, status=status.HTTP_403_FORBIDDEN)

    apps = Application.objects.all()
    serializer = ApplicationSerializer(apps, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_application(request):
    if request.user.role != 'candidate':
        return Response({'error': 'Only candidates can apply for jobs.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        job = Job.objects.get(pk=request.data.get('job'))
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

    application = Application(
        candidate=request.user,
        job=job,
        resume=request.FILES.get('resume'),
        cover_letter=request.data.get('cover_letter')
    )
    application.save()

    resume_path = application.resume.path
    
    # 🧠 Use the Gemini Engine for Unified Parsing and Scoring
    job_context = {
        "role": job.title if hasattr(job, 'title') else "Unknown",
        "description": getattr(job, 'description', ''),
        "required_skills": [s.strip() for s in getattr(job, 'required_skills', '').split(',') if s.strip()] if isinstance(getattr(job, 'required_skills', ''), str) else [],
        "preferred_education": getattr(job, 'preferred_education', '')
    }
    
    # Send to Gemini
    prediction_result = process_application(resume_path, job_context)

    # Save extracted resume data from Gemini
    application.parsed_name = prediction_result.get("Name")
    application.parsed_email = prediction_result.get("Email", "Unknown")
    application.parsed_phone = prediction_result.get("Phone", "Unknown")
    application.parsed_skills = prediction_result.get("Skills", [])
    
    # Save the new extracted fields
    application.parsed_experience = prediction_result.get("Experience (Years)", 0)
    application.parsed_education = prediction_result.get("Education", "Unknown")
    application.parsed_certifications = prediction_result.get("Certifications", "None")
    application.parsed_projects_count = prediction_result.get("Projects Count", 0)

    # Save Scoring and Decisions from Gemini
    application.recruiter_decision = prediction_result.get('Recruiter Decision', 'Reject')
    application.ai_score = prediction_result.get('AI Score', 0.0)
    application.match_explanation = prediction_result.get('Explanation', ['Error evaluating candidate.'])
    
    application.save()

    # Trigger Notification and Email
    notification_msg = f"Your application for {job.title} has been successfully received."
    Notification.objects.create(user=request.user, message=notification_msg)
    try:
        send_mail(
            subject=f"Application Received: {job.title}",
            message=notification_msg,
            from_email="noreply@airecruit.com",
            recipient_list=[request.user.email],
            fail_silently=True,
        )
    except Exception as e:
        print("Error sending email:", e)

    serializer = ApplicationSerializer(application)
    return Response({
    "application": serializer.data,
    "compliance": prediction_result["Compliance"]
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidate_applications(request):
    user = request.user
    if user.role != 'candidate':
        return Response({"error": "Only candidates can view their applications."}, status=status.HTTP_403_FORBIDDEN)

    applications = Application.objects.filter(candidate=user)
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_applications_for_job(request, job_id):
    if request.user.role != 'hr':
        return Response({'error': 'Only HRs can view this information.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        job = Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

    applications = Application.objects.filter(job=job)
    results = []

    for app in applications:
        results.append({
            "application_id": app.id,
            "candidate_name": app.parsed_name,
            "match_score": app.match_score,
            "ai_score": app.ai_score,
            "match_explanation": app.match_explanation,
            "parsed_email": app.parsed_email,
            "parsed_phone": app.parsed_phone,
            "parsed_skills": app.parsed_skills,
            "parsed_experience": app.parsed_experience,
            "parsed_education": app.parsed_education,
            "parsed_certifications": app.parsed_certifications,
            "parsed_projects_count": app.parsed_projects_count,
            "cover_letter": app.cover_letter,
            "resume_url": request.build_absolute_uri(app.resume.url) if app.resume else None
        })

    sorted_data = sorted(results, key=lambda x: x["match_score"], reverse=True)
    return Response(sorted_data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    try:
        app = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user.role != 'hr':
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    status_value = request.data.get("status")
    if status_value not in ["pending", "accepted", "rejected", "shortlisted"]:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    app.status = status_value
    app.save()

    # Trigger Notification and Email
    if status_value in ['accepted', 'shortlisted']:
        msg = f"Congratulations! Your application for {app.job.title} has been {status_value.upper()}."
    else:
        msg = f"Update: Your application for {app.job.title} has been {status_value.upper()}."

    if app.candidate:
        Notification.objects.create(user=app.candidate, message=msg)
        recipient_email = app.candidate.email
    else:
        recipient_email = app.parsed_email

    if recipient_email and recipient_email != "Unknown":
        try:
            send_mail(
                subject=f"Application Status Update: {app.job.title}",
                message=msg,
                from_email="noreply@airecruit.com",
                recipient_list=[recipient_email],
                fail_silently=True,
            )
        except Exception as e:
            print("Error sending email:", e)

    return Response({"message": "Status updated successfully"})


# Getting the stats for candidates
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidate_application_stats(request):
    if request.user.role != 'candidate':
        return Response({'error': 'Only candidates can view their stats.'}, status=status.HTTP_403_FORBIDDEN)

    user = request.user
    applications = Application.objects.filter(candidate=user)

    total_applied = applications.count()
    total_shortlisted = applications.filter(status='accepted').count()
    total_rejected = applications.filter(status='rejected').count()
    total_pending = applications.filter(status='pending').count()

    applied_jobs = list(applications.values('job__id', 'job__title'))
    
    candidate_name = f"{user.first_name} {user.last_name}".strip()
    if not candidate_name:
        candidate_name = user.username

    return Response({
        "candidate_name": candidate_name,
        "total_applied": total_applied,
        "total_shortlisted": total_shortlisted,
        "total_rejected": total_rejected,
        "total_pending": total_pending,
        "applied_jobs": applied_jobs
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def hr_upload_application(request):
    if request.user.role != 'hr' and request.user.role != 'admin':
        return Response({'error': 'Only HRs can upload CVs.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        job = Job.objects.get(pk=request.data.get('job'))
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

    application = Application(
        candidate=None,  # Null candidate for manual HR uploads
        job=job,
        resume=request.FILES.get('resume'),
        cover_letter="Manually uploaded by HR"
    )
    application.save()

    resume_path = application.resume.path
    
    # 🧠 Use the Gemini Engine for Unified Parsing and Scoring
    job_context = {
        "role": job.title if hasattr(job, 'title') else "Unknown",
        "description": getattr(job, 'description', ''),
        "required_skills": [s.strip() for s in getattr(job, 'required_skills', '').split(',') if s.strip()] if isinstance(getattr(job, 'required_skills', ''), str) else [],
        "preferred_education": getattr(job, 'preferred_education', '')
    }
    
    # Send to Gemini
    prediction_result = process_application(resume_path, job_context)

    # Save extracted resume data from Gemini
    application.parsed_name = prediction_result.get("Name")
    application.parsed_email = prediction_result.get("Email", "Unknown")
    application.parsed_phone = prediction_result.get("Phone", "Unknown")
    application.parsed_skills = prediction_result.get("Skills", [])
    
    # Save the new extracted fields
    application.parsed_experience = prediction_result.get("Experience (Years)", 0)
    application.parsed_education = prediction_result.get("Education", "Unknown")
    application.parsed_certifications = prediction_result.get("Certifications", "None")
    application.parsed_projects_count = prediction_result.get("Projects Count", 0)

    # Save Scoring and Decisions from Gemini
    application.recruiter_decision = prediction_result.get('Recruiter Decision', 'Reject')
    application.ai_score = prediction_result.get('AI Score', 0.0)
    application.match_explanation = prediction_result.get('Explanation', ['Error evaluating candidate.'])
    
    application.save()

    serializer = ApplicationSerializer(application)
    return Response({
        "application": serializer.data,
        "compliance": prediction_result.get("Compliance", {})
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_application(request, pk):
    try:
        app = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user.role != 'hr' and request.user.role != 'admin':
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    app.delete()
    return Response({"message": "Application deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def download_marked_resumes(request):
    if request.user.role not in ['hr', 'admin']:
        return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        
    application_ids = request.data.get('application_ids', [])
    if not application_ids:
        return Response({'error': 'No applications selected.'}, status=status.HTTP_400_BAD_REQUEST)
        
    applications = Application.objects.filter(id__in=application_ids)
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="ai_marked_resumes.csv"'
    
    writer = csv.writer(response)
    writer.writerow([
        'Job Title',
        'Applicant Name', 
        'Email',
        'Phone',
        'AI Score (%)',
        'Match Explanation',
        'Parsed Skills',
        'Years Experience',
        'Education',
        'Status'
    ])
    
    for app in applications:
        # Format skills array into string
        skills = app.parsed_skills if app.parsed_skills else []
        skills_str = ", ".join(skills) if isinstance(skills, list) else str(skills)
        
        # Format explanation array into string
        explanation = app.match_explanation if app.match_explanation else []
        explanation_str = " | ".join(explanation) if isinstance(explanation, list) else str(explanation)
        
        # Get correct name
        name = app.parsed_name
        if app.candidate and app.candidate.first_name:
            name = f"{app.candidate.first_name} {app.candidate.last_name}"
            
        # Get correct email
        email = app.parsed_email
        if app.candidate and app.candidate.email:
            email = app.candidate.email
            
        writer.writerow([
            app.job.title if app.job else 'Unknown',
            name or 'Unknown',
            email or 'Unknown',
            app.parsed_phone or 'Unknown',
            app.ai_score or 0,
            explanation_str,
            skills_str,
            app.parsed_experience or 0,
            app.parsed_education or 'Unknown',
            app.status
        ])
        
    return response
