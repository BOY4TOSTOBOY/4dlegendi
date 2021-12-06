#!/usr/bin/env bash

SETTINGS="--settings backend.settings.production"

python3 manage.py loaddata predef/stats.json $SETTINGS
python3 manage.py loaddata predef/questions.json $SETTINGS
python3 manage.py loaddata predef/roles.json $SETTINGS
python3 manage.py loaddata predef/users.json $SETTINGS
sh predef/loadques.sh
