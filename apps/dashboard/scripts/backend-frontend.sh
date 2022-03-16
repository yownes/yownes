#!/bin/bash
echo "Compiling..."
tsc

echo "Generating bundle..."
# Updates the base url from index.html
vite build --base=/static/yownes/

echo "Copying files into dashboard..."
cd ../backend
pipenv run make update-frontend
cd ../dashboard

echo "Frontend del plugin de PrestaShop actualidado!"