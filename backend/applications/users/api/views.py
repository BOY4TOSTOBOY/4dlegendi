from django.utils import timezone
from django.contrib.auth.admin import sensitive_post_parameters_m
from rest_framework import status, generics, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.decorators import authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet


from applications.users.api.serializers import *
from applications.users.models import *
from applications.legending.models import *


# TODO: Сейчас авторизация через соц. сети сделана на фронте, в связи с этим на
# TODO: бэк отправляются сценерированные на фронте данные. Считаю данный метод
# TODO: ненадежным и на будущее предлагаю переделать все на бэк'e.


@api_view(['POST', ])
@authentication_classes([])
@permission_classes([])
def registration_view(request):
    if request.method == "POST":
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', ])
@authentication_classes([])
@permission_classes([])
def check_users(request):
    username = request.query_params.get('username')
    if not username:
        return Response("Username in parameters", status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(username=username)
    if user:
        return Response(data={"exists": True}, status=status.HTTP_200_OK)
    else:
        return Response(data={"exists": False}, status=status.HTTP_200_OK)


class UserModelView(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)

        # a = Order.objects.filter(user=self.request.user).last()
        # if a:
        #     if self.request.user.date_end:
        #         if not self.request.user.date_end > timezone.now():
        #             a.status = False
        #             a.save()
        return Response(serializer.data)


class PasswordResetView(generics.GenericAPIView):
    """
    Calls Django Auth PasswordResetForm save method.
    Accepts the following POST parameters: email
    Returns the success/fail message.
    """
    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        # Create a serializer with request.data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        # Return the success message with OK HTTP status
        return Response(
            {"detail": "Password reset e-mail has been sent."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(generics.GenericAPIView):
    """
    Password reset e-mail link is confirmed, therefore
    this resets the user's password.
    Accepts the following POST parameters: token, uid,
        new_password1, new_password2
    Returns the success/fail message.
    """
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super(PasswordResetConfirmView, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password has been reset with the new password."}
        )


class FeedbackViewSet(CreateModelMixin, GenericViewSet):
    queryset = Feedback.objects.order_by('pk')
    serializer_class = FeedbackSerializer


class RoleList(generics.ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RoleSerializer

    def get_queryset(self):
        return Role.objects.all()
