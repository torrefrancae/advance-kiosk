# Advance Kiosk (BeeJoy)

React + Laravel monorepo demo for a QSR-style self-service flow.

Laravel serves the API and mounts the built React static files under `/sample/advance-kiosk/`, same idea as the AI chart sample app.

## Screens

| Path | Role |
|---|---|
| `/sample/advance-kiosk/` | Hub |
| `/sample/advance-kiosk/kiosk` | Guest self-service kiosk |
| `/sample/advance-kiosk/pos` | Staff POS with live tickets + checkout |
| `/sample/advance-kiosk/status` | Lobby board (queue -> preparing -> ready) |

## Local

```bash
chmod +x serve.sh
./serve.sh --headless --port=3094
./serve.sh --restore
```

Manual:

```bash
cd client && npm install && npm run build
cd ../backend && composer install
php artisan migrate --force
php artisan serve --host=127.0.0.1 --port=3094
```

Health: http://127.0.0.1:3094/sample/advance-kiosk/api/health

## Stack

- `client/` Vite React TypeScript UI
- `backend/` Laravel 11 + SQLite orders API + SSE/live poll
- Build output lands in `backend/public/kiosk-dist/` and Laravel mounts it at `/sample/advance-kiosk/`

## Notes

Demo brand is **BeeJoy** (inspired by Filipino QSR kiosk UX, not an official brand).
