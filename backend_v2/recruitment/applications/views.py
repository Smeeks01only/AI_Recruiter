from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job

from ai_engine.resume_parser.parse_single import parse_resume_file
from ai_engine.ml_models_utils import predict_resume



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
    job_role = job.title if hasattr(job, 'title') else "Unknown"

    # Parse resume
    parsed_data = parse_resume_file(resume_path, job_role)

    # Save extracted resume data
    application.parsed_name = parsed_data.get("Name")
    application.parsed_email = parsed_data.get("Email", "Unknown")
    application.parsed_phone = parsed_data.get("Phone", "Unknown")
    application.parsed_skills = parsed_data.get("Skills", [])
    application.save()

    # Prepare data for prediction
    model_input = {
        "Skills": parsed_data.get("Skills", []),
        "Experience (Years)": parsed_data.get("Experience (Years)", 0),
        "Education": parsed_data.get("Education", "Unknown"),
        "Certifications": parsed_data.get("Certifications", "None"),
        "Job Role": parsed_data.get("Job Role", "Unknown"),
        "Projects Count": parsed_data.get("Projects Count", 0),
    }

    # Predict match score and decision
    prediction_result = predict_resume(model_input)
    application.recruiter_decision = prediction_result['Recruiter Decision']
    application.ai_score = prediction_result['AI Score']
    application.match_explanation = prediction_result['Explanation']  # 👈 Add this line for the explanations functionality
    application.save()

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
            "parsed_email": app.parsed_email,
            "parsed_phone": app.parsed_phone,
            "parsed_skills": app.parsed_skills,
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
    if status_value not in ["pending", "accepted", "rejected"]:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    app.status = status_value
    app.save()
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

    return Response({
        "total_applied": total_applied,
        "total_shortlisted": total_shortlisted,
        "total_rejected": total_rejected,
        "total_pending": total_pending,
        "applied_jobs": applied_jobs
    })

