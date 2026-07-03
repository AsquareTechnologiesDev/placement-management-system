#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py shell -c "
from accounts.models import User;
User.objects.filter(email='admin@asquaretechnologiesweb.com').exists() or User.objects.create_superuser(
email='admin@asquaretechnologiesweb.com',
password='Admin@asquare123',
first_name='Admin',
last_name='Asquare',
role=User.Role.ADMIN
)"

python manage.py collectstatic --no-input
python manage.py migrate