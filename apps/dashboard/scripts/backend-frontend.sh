#!/bin/bash
echo "Compiling..."
tsc

echo "Generating bundle..."
# Updates the base url from index.html
vite build --base=/static/yownes/

echo "Copying files into dashboard..."
cd /home/ubuntu/yownes/apps/backend
/home/ubuntu/.local/bin/pipenv install
/home/ubuntu/.local/bin/pipenv run make update-frontend

echo "Frontend from Backend updated!"