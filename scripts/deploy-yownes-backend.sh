#!/bin/bash
git pull
yarn
yarn turbo run @yownes/dashboard#build
sudo service yownes restart
