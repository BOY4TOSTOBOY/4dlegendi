from django.conf.urls import url
from django.views.generic import TemplateView

from backend.urls.base import *

urlpatterns += [
    url(r'^.*$', TemplateView.as_view(template_name="index.html"))
]
