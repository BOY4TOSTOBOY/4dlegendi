from django.contrib import admin
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.http import urlencode
from django.utils.html import format_html

from applications.users.models import Feedback, Role

User = get_user_model()


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    # model = Role
    list_display = ['name', 'get_questions_links']

    # Метод кастомизации вопросов под роли (отображение в панеле администратора)
    def get_questions_links(self, obj):
        url = (
            reverse("admin:legending_question_changelist")
            + "?"
            + urlencode({"role__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">Кастомизированные вопросы</a>', url)

    get_questions_links.short_description = "Вопросы, относящиеся к данной роли"


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # model = Role
    list_display = ['email', 'role', 'get_date_order_end', 'get_support', ]

    # Дата окончания подписки
    def get_date_order_end(self, obj):
        url = (
            reverse("admin:legending_order_changelist")
            + "?"
            + urlencode({"user__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">Действующие подписки</a>', url)

    # Дата окончания подписки
    def get_support(self, obj):
        url = (
            reverse("admin:legending_support_changelist")
            + "?"
            + urlencode({"user__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">Обращения в поддержку</a>', url)

    get_date_order_end.short_description = "Подписки"

    get_support.short_description = "Обращения"


admin.site.register(Feedback)
