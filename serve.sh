#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-3094}"
MODE=""
cd "$ROOT"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --headless) MODE="headless" ;;
    --restore|stop) MODE="restore" ;;
    --port=*) PORT="${1#*=}" ;;
    --port)
      shift
      PORT="${1:-}"
      ;;
    -h|--help)
      echo "Usage: $0 [--headless] [--restore] [--port=3094]"
      exit 0
      ;;
  esac
  shift
done

export PATH="/opt/homebrew/opt/php@8.2/bin:/opt/homebrew/opt/php@8.2/sbin:/opt/homebrew/bin:${PATH}"

PID_FILE="$ROOT/.serve-headless-${PORT}.pid"
LOG_FILE="$ROOT/debug.log"
BACKEND="$ROOT/backend"

is_up() {
  curl -fsS -o /dev/null --max-time 2 "http://127.0.0.1:${PORT}/sample/advance-kiosk/api/health" >/dev/null 2>&1
}

stop_old() {
  if [[ -f "$PID_FILE" ]]; then
    old="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [[ -n "${old:-}" ]] && kill -0 "$old" 2>/dev/null; then
      pkill -P "$old" 2>/dev/null || true
      kill "$old" 2>/dev/null || true
      sleep 1
      kill -9 "$old" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
}

if [[ "$MODE" == "restore" ]]; then
  stop_old
  echo "stopped advance-kiosk"
  exit 0
fi

if [[ "$MODE" != "headless" ]]; then
  echo "Use --headless for detached local serving (required in this workspace)."
  exit 1
fi

stop_old
: >"$LOG_FILE"

if [[ ! -d "$ROOT/client/node_modules" ]]; then
  (cd "$ROOT/client" && npm install) >>"$LOG_FILE" 2>&1
fi

if [[ ! -d "$BACKEND/vendor" ]]; then
  (cd "$BACKEND" && composer install --no-interaction) >>"$LOG_FILE" 2>&1
fi

if [[ ! -f "$BACKEND/.env" ]]; then
  cp "$BACKEND/.env.example" "$BACKEND/.env"
  (cd "$BACKEND" && php artisan key:generate --force) >>"$LOG_FILE" 2>&1
fi

touch "$BACKEND/database/database.sqlite"
(cd "$BACKEND" && php artisan migrate --force) >>"$LOG_FILE" 2>&1
(cd "$ROOT/client" && npm run build) >>"$LOG_FILE" 2>&1

nohup sh -c "cd \"$BACKEND\" && php artisan serve --host=127.0.0.1 --port=$PORT 2>&1 | tr -d '\\000' | stdbuf -oL strings -n 1 >> \"$LOG_FILE\"" >/dev/null 2>&1 &
echo $! >"$PID_FILE"

for _ in $(seq 1 40); do
  if is_up; then
    echo "ready http://127.0.0.1:${PORT}/sample/advance-kiosk/"
    sleep 5
    head -n 60 "$LOG_FILE" || true
    exit 0
  fi
  sleep 1
done

echo "failed to start; see $LOG_FILE" >&2
exit 1
