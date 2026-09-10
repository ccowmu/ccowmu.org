#!/usr/bin/env bash
# Build the site for http://localhost:1313/ and serve it.
# Run this script again after each edit. The server keeps running.
set -euo pipefail
cd "$(dirname "$0")"
PORT="${PORT:-1313}"
BASE_URL="http://localhost:${PORT}/" ./build.sh
if ! lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
	python3 -m http.server "$PORT" --directory public --bind 127.0.0.1 >/dev/null 2>&1 &
	echo "Serving on http://localhost:${PORT}/"
else
	echo "Rebuilt. http://localhost:${PORT}/ is already serving."
fi
