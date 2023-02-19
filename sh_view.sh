#!/bin/bash
cd "$( cd "$( dirname "$0" )"; pwd )"

python -m http.server
