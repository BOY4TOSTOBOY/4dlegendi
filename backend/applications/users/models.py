from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.Model):
    """
    Роль участника
    """
    # Имя
    name = models.CharField(null=False, blank=False, max_length=100)

    def __str__(self):
        return '%s' % self.name

    class Meta:
        verbose_name = '[Role] Роль'
        verbose_name_plural = '[Role] Роли'


class User(AbstractUser):
    """
    Пользователь системы
    """
    # E-mail
    email = models.EmailField(unique=True)

    # роль
    role = models.ForeignKey(Role, null=True, on_delete=models.SET_NULL)

    count_orders = models.IntegerField(default=0)

    # Количество переходов на страницу "тема дня"
    click_theme_day_count = models.IntegerField(default=0)

    # Количество нажатий на экспорт
    click_export_count = models.IntegerField(default=0)

    # для бесплатки events
    last_event = models.IntegerField(default=0)

    class Meta:
        verbose_name = '[User] Пользователь системы'
        verbose_name_plural = '[User] Пользователи системы'


class Feedback(models.Model):
    """
    Модель обратной связи
    """
    text_like = models.TextField(blank=True, null=True, default='', verbose_name='Что понравилось')
    text_better = models.TextField(blank=True, null=True, default='', verbose_name='Что могло быть лучше')

    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='feedback',
                              verbose_name='Пользователь')

    created = models.DateTimeField(auto_now_add=True, help_text='Auto-generated field')
    updated = models.DateTimeField(auto_now=True, help_text='Auto-generated and auto-updated field')

    class Meta:
        verbose_name = '[Feedback] Обратная связь'
        verbose_name_plural = '[Feedback] Обратная связь'
