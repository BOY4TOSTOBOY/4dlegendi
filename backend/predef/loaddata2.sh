#!/usr/bin/env bash

SETTINGS="--settings backend.settings.base"

python manage.py loaddata predef/stats.json $SETTINGS
python manage.py loaddata predef/questions.json $SETTINGS
python manage.py loaddata predef/roles.json $SETTINGS
python manage.py loaddata predef/users.json $SETTINGS
sh predef/loadques2.sh
