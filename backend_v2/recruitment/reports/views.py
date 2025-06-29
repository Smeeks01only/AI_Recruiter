# reports/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# from reports.analytics.application_stats import get_match_score_stats_per_job
# from reports.analytics.bias_summary import get_bias_summary_report

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def match_score_report(request):
    if request.user.role != 'hr':
        return Response({'error': 'Only HRs can view match score reports.'}, status=403)
    
    report = "This is a placeholder for the match score report. Replace with actual implementation."
    return Response(report)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bias_summary_report(request):
    if request.user.role != 'hr':
        return Response({'error': 'Only HRs can view bias reports.'}, status=403)

    #report = get_bias_summary_report()
    return Response("This is a placeholder for the bias summary report. Replace with actual implementation.")
