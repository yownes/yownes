all: setup django-setup

setup:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	mkdir -p tmp/

django-setup: setup
	python manage.py migrate
	python manage.py djstripe_init_customers
	# python manage.py djstripe_sync_plans_from_stripe

fix-style:
	isort .

lint:
	flake8 backend/

update-frontend:
	python manage.py collectstatic --clear --noinput

test:
	reset && python manage.py test

run:
	python manage.py runserver 0.0.0.0:8000

prepush: lint test
	
