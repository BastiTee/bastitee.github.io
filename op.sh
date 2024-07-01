#!/bin/bash
cd "$( cd "$( dirname "$0" )"; pwd )"

if [ "$1" == "push" ]; then
    git add .
    git commit -m "Update homepage"
    git push -u origin HEAD
elif [ "$1" == "serve" ]; then
    python -m http.server
else
    echo "Usage: $0 push|serve"
fi
