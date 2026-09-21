from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Users, Notification, PlatformSettings, SecuritySettings, SecurityLog
from .serializers import UsersSerializer, NotificationSerializer, PlatformSettingsSerializer, SecuritySettingsSerializer, SecurityLogSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes


#Create auth views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Only admins can view users.'}, status=status.HTTP_403_FORBIDDEN)

    users = Users.objects.all()
    serializer = UsersSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Only admins can create users.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UsersSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Candidates registering
@api_view(['POST'])
def register_candidate(request):
    data = request.data.copy()
    if 'role' not in data:
        data['role'] = 'candidate'  # default to candidate if not provided

    serializer = UsersSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, pk):
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Only admins can manage users.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UsersSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UsersSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    user = request.user

    if request.method == 'GET':
        serializer = UsersSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UsersSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(user=request.user)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

    notification.is_read = True
    notification.save()
    return Response({'message': 'Notification marked as read'})

from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow anyone to hit this just once to seed
def seed_users(request):
    """Temporary endpoint to seed the database with Admin and HR accounts"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    messages = []
    
    admin, created1 = User.objects.get_or_create(username='admin', defaults={'email': 'admin@admin.com', 'role': 'admin'})
    if created1:
        admin.set_password('admin123')
        admin.is_superuser = True
        admin.is_staff = True
        admin.save()
        messages.append("Admin created successfully! (admin / admin123)")
        
    hr, created2 = User.objects.get_or_create(username='hr', defaults={'email': 'hr@hr.com', 'role': 'hr'})
    if created2:
        hr.set_password('hr123')
        hr.is_staff = True
        hr.save()
        messages.append("HR created successfully! (hr / hr123)")
        
    if not created1 and not created2:
        return Response({"message": "Accounts already exist!"})
        
    return Response({"message": " | ".join(messages)})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def platform_settings_view(request):
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Only admins can view or modify settings.'}, status=status.HTTP_403_FORBIDDEN)
        
    settings = PlatformSettings.load()
    if request.method == 'GET':
        serializer = PlatformSettingsSerializer(settings)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        serializer = PlatformSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def security_settings_view(request):
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Only admins can view or modify settings.'}, status=status.HTTP_403_FORBIDDEN)
        
    settings = SecuritySettings.load()
    if request.method == 'GET':
        serializer = SecuritySettingsSerializer(settings)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        serializer = SecuritySettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def security_logs_view(request):
    if not request.user.is_superuser and request.user.role != 'admin':
        return Response({'error': 'Only admins can view security logs.'}, status=status.HTTP_403_FORBIDDEN)
    
    logs = SecurityLog.objects.all()
    
    # Get only the latest 10 logs
    logs = logs[:10]
    serializer = SecurityLogSerializer(logs, many=True)
    return Response(serializer.data)
