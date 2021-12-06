#!/usr/bin/env bash

SETTINGS="--settings backend.settings.base"

python manage.py loaddata predef/answer_checks.json $SETTINGS
python manage.py loaddata predef/templates.json $SETTINGS
python manage.py loaddata predef/texts.json $SETTINGS
python manage.py loaddata predef/characters.json $SETTINGS
python manage.py loaddata predef/character_selection.json $SETTINGS
python manage.py loaddata predef/rate.json $SETTINGS
python manage.py loaddata predef/order.json $SETTINGS
python manage.py loaddata predef/vouch.json $SETTINGS
