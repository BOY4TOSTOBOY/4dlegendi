import io
import json

from applications.users.models import User, Role, Feedback

from django.contrib.auth import get_user_model
from django.core.files import File
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

User = get_user_model()


# Тестирование модели Role
class RoleModelTest(TestCase):

    @classmethod
    # создание объекта для тестирования
    def setUpTestData(cls):
        cls.role = Role.objects.create(name='ТестоваяРоль')

    # тестирование поля 'name'
    def test_name_label(self):
        role = self.role
        name = role._meta.get_field('name').verbose_name
        self.assertEquals(name, 'name')

    # тестирование метода '__str__'
    def test_str(self):
        role = self.role
        self.assertEquals(role.__str__(), 'ТестоваяРоль')


# Тестирование модели User
class UserModelTest(TestCase):

    @classmethod
    # создание объекта для тестирования
    def setUpTestData(cls):
        cls.user = User.objects.create(email='testemail@mail.ru')

    # тестирование поля 'email'
    def test_email_label(self):
        user = self.user

        # Получение метаданных поля для получения необходимых значений
        email = user._meta.get_field('email').verbose_name

        # Сравнение значения с ожидаемым результатом
        self.assertEquals(email, 'email')
