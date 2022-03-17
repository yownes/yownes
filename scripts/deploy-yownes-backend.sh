#!/bin/bash
cd yownes
git pull
yarn
yarn turbo run @yownes/dashboard#build:backend
sudo service yownes restart
