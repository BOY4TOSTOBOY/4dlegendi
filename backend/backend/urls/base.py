from django.conf.urls import url
from django.contrib import admin
from django.urls import include

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/legending/', include('applications.legending.api.urls', )),
    url(r'^api/users/', include('applications.users.api.urls')),
]
