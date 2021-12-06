from django.conf.urls import url
from rest_framework.authtoken import views

from applications.users.api.views import registration_view, check_users, PasswordResetView, \
    PasswordResetConfirmView, UserModelView, FeedbackViewSet, RoleList
from applications.users.apps import UsersConfig

app_name = UsersConfig.name

urlpatterns = [
    url(r'registration/$', registration_view, name='registration'),
    url(r'login/$', views.obtain_auth_token, name='login'),
    url(r'check-user/$', check_users, name='check-user'),
    url(r'profile/$', UserModelView.as_view({'get': 'retrieve'}), name='profile'),
    url(r'password/reset/$', PasswordResetView.as_view(), name='password_reset'),
    url(r'password/reset/confirm/$', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    url(r'feedback/', FeedbackViewSet.as_view({'post': 'create'}), name='feedback'),
    url(r'role/', RoleList.as_view(), name='role')
]
