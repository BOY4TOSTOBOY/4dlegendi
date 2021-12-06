### STAGE 1: Build ###
FROM node:10-alpine as builder
MAINTAINER Artem Demidenko <ar.demidenko@gmail.com>

RUN mkdir -p /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm ci && cp -R ./node_modules /app/frontend
WORKDIR /app/frontend
COPY frontend/ /app/frontend
RUN node --max_old_space_size=16384 node_modules/@angular/cli/bin/ng build --prod --base-href='/' --deploy-url='/static/'

### STAGE 2: WEB ###
FROM debian:10 AS web
MAINTAINER Artem Demidenko <ar.demidenko@gmail.com>

RUN apt-get update

RUN apt-get -y dist-upgrade
RUN apt-get install -y wget gnupg p7zip-full
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main' >  /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get update
RUN apt-get install -y postgresql-client-10
RUN apt-get install -y git
RUN apt-get install -y python3
RUN apt-get install -y python3-dev
RUN apt-get install -y python3-setuptools
RUN apt-get install -y python3-pip
RUN apt-get install -y nginx
RUN apt-get install -y supervisor
RUN apt-get install -y sqlite3
RUN apt-get install -y software-properties-common
RUN apt-get install -y locales
RUN apt-get install -y nano
RUN apt-get install -y mc

ENV LANG ru_RU.UTF-8
ENV LC_ALL ru_RU.UTF-8
ENV LANGUAGE ru_RU.UTF-8

RUN sed -i -e 's/# ru_RU.UTF-8 UTF-8/ru_RU.UTF-8 UTF-8/' /etc/locale.gen && \
    sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=ru_RU.UTF-8 && \
    echo "LANGUAGE=ru_RU.UTF-8" >> /etc/default/locale && \
    echo "LC_ALL=ru_RU.UTF-8" >> /etc/default/locale

RUN	pip3 install setuptools && \
	rm -rf /var/lib/apt/lists/* && \
	pip3 install uwsgi

ARG DJANGO_SETTINGS_MODULE='backend.settings.production'
ARG DATABASE_NAME='legending_db'
ARG DATABASE_USER='legending'
ARG DATABASE_PASSWORD='qwerty123'
ARG DATABASE_HOST='localhost'
ARG DATABASE_PORT=5432
ARG EMAIL_HOST_USER='legending@list.ru'
ARG EMAIL_HOST_PASSWORD='SCWJCdWaHXpR9B7dk3pH'

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE='backend.settings.production'
ENV DATABASE_NAME='legending_db'
ENV DATABASE_USER='legending'
ENV DATABASE_PASSWORD='qwerty123'
ENV DATABASE_HOST='localhost'
ENV DATABASE_PORT=5432
ENV EMAIL_HOST_USER='legending@list.ru'
ENV EMAIL_HOST_PASSWORD='SCWJCdWaHXpR9B7dk3pH'


RUN mkdir -p /app/configs
RUN mkdir -p /app/backend
RUN mkdir -p /app/bin

COPY bin/wait-for-postgres.sh /usr/bin/wait-for-postgres.sh
COPY backend/requirements.txt /app/backend/requirements.txt
COPY configs/uwsgi-app.ini /app/configs/uwsgi-app.ini
COPY configs/uwsgi_params /app/configs/uwsgi_params

COPY --from=builder /app/frontend/dist/index.html /app/backend/templates/index.html
COPY --from=builder /app/frontend/dist/ /app/backend/static/


RUN echo 'daemon off;' >> /etc/nginx/nginx.conf
COPY configs/nginx-app.conf /etc/nginx/sites-available/default
COPY configs/supervisor-app.conf /etc/supervisor/conf.d/supervisor-app.conf

RUN pip3 install -r /app/backend/requirements.txt

WORKDIR /app/backend
COPY backend/ /app/backend

RUN chown -R www-data:www-data .

VOLUME '/app/backend'
VOLUME '/app/bin'
VOLUME '/app/configs'

EXPOSE 80

CMD ["supervisord", "-n"]
