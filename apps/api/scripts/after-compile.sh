#!/usr/bin/env sh
set -e
cd "$(dirname "$0")/.."
tsc-alias -p tsconfig.build.json
exec node dist/main.js
