from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.tokens import default_token_generator
from django.core import exceptions
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode as uid_decoder
from django.utils.translation import gettext as _
from applications.legending.api.serializers import *
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from applications.legending.models import *
from applications.users.models import *

UserModel = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'confirm_password',
                  'first_name', 'last_name', 'role']

        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def save(self):
        user = User(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
            role=self.validated_data['role']
        )

        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']

        if password != confirm_password:
            raise serializers.ValidationError({
                'password': _('Passwords must be match!')
            })

        try:
            password_validation.validate_password(password=password, user=User)
        except exceptions.ValidationError as err:
            raise serializers.ValidationError({
                'password': list(err.messages)
            })

        user.set_password(password)
        user.save()
        stats = Statistics.objects.all().first()
        # вычисляем сколько людей определенной роли
        if user.role_id == 1:
            stats.role_blogger += 1
        elif user.role_id == 2:
            stats.role_expert += 1
        elif user.role_id == 3:
            stats.role_seller += 1
        # общее количество зарегистрированных
        stats.count_users += 1
        stats.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    is_generate = serializers.SerializerMethodField(read_only=True)
    date_end = serializers.SlugRelatedField(
            read_only=True,
            slug_field='date_end',
            default=""
    )

    class Meta:
        model = User
        exclude = ()

    def get_is_generate(self, value):
        return Answer.objects.filter(user=value).exists()


class PasswordResetSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset e-mail.
    """
    email = serializers.EmailField()

    password_reset_form_class = PasswordResetForm

    def get_email_options(self):
        """Override this method to change default e-mail options"""
        return {}

    def validate_email(self, value):
        # Create PasswordResetForm with the serializer
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

        return value

    def save(self):
        request = self.context.get('request')
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'request': request,
            'subject_template_name': '../templates/password_reset_subject.txt',
            'html_email_template_name': '../templates/password_reset_email.html',
            'email_template_name': '../templates/password_reset_email.html',
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for requesting a password reset e-mail.
    """
    new_password1 = serializers.CharField(max_length=128)
    new_password2 = serializers.CharField(max_length=128)
    uid = serializers.CharField()
    token = serializers.CharField()

    set_password_form_class = SetPasswordForm

    def custom_validation(self, attrs):
        pass

    def validate(self, attrs):
        self._errors = {}

        # Decode the uidb64 to uid to get User object
        try:
            uid = force_text(uid_decoder(attrs['uid']))
            self.user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            raise ValidationError({'Ошибка': ['Данная ссылка уже была использована']})

        self.custom_validation(attrs)
        # Construct SetPasswordForm instance
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)
        if not default_token_generator.check_token(self.user, attrs['token']):
            raise ValidationError({'Ошибка': ['Данная ссылкаа уже была использована']})

        return attrs

    def save(self):
        return self.set_password_form.save()


class FeedbackSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Feedback
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        exclude = ()
