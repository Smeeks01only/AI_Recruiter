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
    
     # Auth endpoints
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
