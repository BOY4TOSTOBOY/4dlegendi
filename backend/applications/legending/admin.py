from django.contrib import admin

from applications.legending.models import *


class NewsAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'question', 'min_elements', 'user', )


class NewsElementAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'news', 'user', 'count', )


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'unique_id', 'rate', 'user', 'date_start', 'date_end', 'status', )


class SupportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'subject', 'text', )


admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Check)
admin.site.register(Event)
admin.site.register(Template)
admin.site.register(Title)
admin.site.register(Text)
admin.site.register(AnswersQueue)
admin.site.register(Character)
admin.site.register(CharacterSelection)
admin.site.register(News, NewsAdmin)
admin.site.register(NewsElement, NewsElementAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Rate)
admin.site.register(Statistics)
admin.site.register(Support, SupportAdmin)
admin.site.register(Voucher)
