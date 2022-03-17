#!/bin/bash
cd yownes
git pull
sudo systemctl daemon-reload # in case backend.service has changed
yarn
yarn turbo run @yownes/dashboard#build:backend
sudo service yownes restart
