#!/usr/bin/env bash

SETTINGS="--settings backend.settings.production"

python3 manage.py loaddata predef/answer_checks.json $SETTINGS
python3 manage.py loaddata predef/templates.json $SETTINGS
python3 manage.py loaddata predef/texts.json $SETTINGS
python3 manage.py loaddata predef/characters.json $SETTINGS
python3 manage.py loaddata predef/character_selection.json $SETTINGS
python3 manage.py loaddata predef/rate.json $SETTINGS
python3 manage.py loaddata predef/order.json $SETTINGS
python3 manage.py loaddata predef/vouch.json $SETTINGS