#!/bin/sh
# Startet die LCARS-Oberfläche über einen lokalen Webserver (Port 8734)
# und öffnet sie im Standardbrowser. Funktioniert unter macOS und Linux.
DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8734
cd "$DIR" || exit 1
( python3 -m http.server "$PORT" >/dev/null 2>&1 & echo $! > /tmp/lcars-server.pid )
sleep 1
URL="http://localhost:$PORT/"
if command -v open >/dev/null 2>&1; then open "$URL"; elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"; fi
echo "LCARS läuft auf $URL (Server-PID: $(cat /tmp/lcars-server.pid))"
