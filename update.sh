#!/bin/bash
cd "$( cd "$( dirname "$0" )"; pwd )"

git add .
git commit -m "Update homepage"
git push -u origin HEAD
