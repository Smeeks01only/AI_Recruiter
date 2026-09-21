from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.get_users, name='get_users'),
    path('create/', views.create_user, name='create_user'),
    path('<int:pk>/', views.user_detail, name='user_detail'),
    path('register/', views.register_candidate, name='register_candidate'),
    path('me/', views.current_user_view, name='current_user'),
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/<int:pk>/read/', views.mark_notification_read, name='mark_notification_read'),
    
     # Auth endpoints
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Temporary seed endpoint
    path('seed/', views.seed_users, name='seed_users'),
    
    # Settings endpoints
    path('settings/platform/', views.platform_settings_view, name='platform_settings'),
    path('settings/security/', views.security_settings_view, name='security_settings'),
    path('security/logs/', views.security_logs_view, name='security_logs'),
]
