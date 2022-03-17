#!/bin/bash
echo "Compiling..."
tsc

echo "Generating bundle..."
# Mode plugin loads .env.plugin variables
vite build --mode plugin

echo "Copying files into plugin..."
cp -r dist ../prestashop-plugin/views/js/yownes

echo "PrestaShop Frontend plugin updated!"