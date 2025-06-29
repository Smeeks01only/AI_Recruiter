import os
import tempfile
import threading
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .ml_models_utils import predict_resume
from .resume_parser.parse_single import parse_resume_file
from .retrain_model import train_and_save_models
from .permissions import IsAdminRole  # ✅ Import custom permission
from .bias_audit import detect_bias
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser


@csrf_exempt
@require_POST
def upload_resume(request):
    uploaded_file = request.FILES.get('resume')
    job_role = request.POST.get('job_role')

    if not uploaded_file or not job_role:
        return JsonResponse({'error': 'Resume file and job role are required.'}, status=400)

    ext = os.path.splitext(uploaded_file.name)[1].lower()
    if ext not in [".pdf", ".docx"]:
        return JsonResponse({'error': f'Unsupported file format: {ext}'}, status=400)

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp:
        for chunk in uploaded_file.chunks():
            temp.write(chunk)
        temp_path = temp.name

    try:
        parsed_data = parse_resume_file(temp_path, job_role)
        parsed_data['Job Role'] = job_role
        result = predict_resume(parsed_data)
        return JsonResponse(result)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    finally:
        os.remove(temp_path)



# Retraining and Model Status Endpoints
@api_view(['POST'])
@permission_classes([IsAdminRole])  # ✅ Custom role-based permission
def retrain_model_view(request):
    """
    API endpoint to trigger the model retraining process.
    Accessible only by users with role='admin'.
    """
    try:
        thread = threading.Thread(target=train_and_save_models)
        thread.daemon = True
        thread.start()

        return Response(
            {"message": "Model retraining process has been started in the background. It may take a few minutes to complete."},
            status=status.HTTP_202_ACCEPTED
        )
    except Exception as e:
        return Response(
            {"error": f"Failed to start retraining process: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAdminRole])  # ✅ Custom role-based permission
def model_status_view(request):
    """
    API endpoint to get the last trained date of the model.
    Accessible only by users with role='admin'.
    """
    try:
        last_trained_path = os.path.join(settings.BASE_DIR, 'models', 'last_trained.txt')
        if os.path.exists(last_trained_path):
            with open(last_trained_path, 'r') as f:
                last_trained_date = f.read().strip()
            return Response({"last_trained": last_trained_date}, status=status.HTTP_200_OK)
        else:
            return Response({"last_trained": "Unknown"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Could not retrieve model status: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Bias Detection Endpoint
@api_view(['GET'])
@permission_classes([IsAdminRole])
def bias_report_view(request):
    """
    Endpoint to get AI bias detection report.
    """
    sensitive_column = request.query_params.get('column', 'Gender')
    report = detect_bias(sensitive_column)
    return Response(report)