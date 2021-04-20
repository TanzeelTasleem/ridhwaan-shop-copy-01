#!/usr/bin/env bash

set -e
set -o pipefail
set -v

echo "stackbit-build.sh: start build"

# build site 
npm run build && cd functions && npm install  

./inject-netlify-identity-widget.js public

echo "stackbit-build.sh: finished build"
