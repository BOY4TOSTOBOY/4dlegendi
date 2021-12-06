from rest_framework_nested import routers

from applications.legending.api.views import *
from applications.legending.apps import LegendingConfig


app_name = LegendingConfig.name

question_router = routers.DefaultRouter()
question_router.register(r'questions', QuestionViewSet, basename=app_name)
urlpatterns = question_router.urls

answer_router = routers.DefaultRouter()
answer_router.register(r'answers', AnswerViewSet, basename=app_name)
urlpatterns += answer_router.urls

titles_router = routers.DefaultRouter()
titles_router.register(r'titles', TitleViewSet, basename=app_name)
urlpatterns += titles_router.urls

events_router = routers.DefaultRouter()
events_router.register(r'events', EventViewSet, basename=app_name)
urlpatterns += events_router.urls

templates_router = routers.DefaultRouter()
templates_router.register(r'templates', TextViewSet, basename=app_name)
urlpatterns += templates_router.urls

news_router = routers.DefaultRouter()
news_router.register(r'^news', NewsViewSet, basename=app_name)
urlpatterns += news_router.urls

question_for_new_router = routers.DefaultRouter()
question_for_new_router.register(r'questions_for_news', QuestionListViewSet, basename='questions_for_news')
urlpatterns += question_for_new_router.urls

elements_router = routers.DefaultRouter()
elements_router.register(r'news/(?P<id>\d+)/elements', NewsElementViewSet, basename='elements')
urlpatterns += elements_router.urls

character_router = routers.DefaultRouter()
character_router.register(r'^character', CharacterViewSet, basename=app_name)
urlpatterns += character_router.urls

rate_router = routers.DefaultRouter()
rate_router.register(r'rates', RateViewSet, basename=app_name)
urlpatterns += rate_router.urls

order_router = routers.DefaultRouter()
order_router.register(r'orders', OrderViewSet, basename=app_name)
urlpatterns += order_router.urls

stats_router = routers.DefaultRouter()
stats_router.register(r'stats', StatisticsViewSet, basename=app_name)
urlpatterns += stats_router.urls

support_router = routers.DefaultRouter()
support_router.register(r'support', SupportViewSet, basename=app_name)
urlpatterns += support_router.urls

payment_true_router = routers.DefaultRouter()
payment_true_router.register(r'after-payment', AfterPaymentViewSet, basename=app_name)
urlpatterns += payment_true_router.urls
