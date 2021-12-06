from backend.settings.base import *

DEBUG = False

ALLOWED_HOSTS = ['*', ]

ROOT_URLCONF = 'backend.urls.production'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('POSTGRES_DATABASE', 'legending_db'),
        'USER': os.getenv('POSTGRES_USER', 'legending'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'qwerty123'),
        'HOST': os.getenv('POSTGRES_HOST', '127.0.0.1'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mail.ru'
EMAIL_HOST_USER = 'legending@list.ru'
EMAIL_HOST_PASSWORD = 'SCWJCdWaHXpR9B7dk3pH'
EMAIL_PORT = 2525
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'legending@list.ru'
SERVER_EMAIL = EMAIL_HOST_USER
