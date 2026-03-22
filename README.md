# Telegram Mini App — демо «личный кабинет»

Небольшой публичный пример для портфолио: React + TypeScript + SCSS, интеграция с **Telegram Web Apps** через [`@twa-dev/sdk`](https://github.com/twa-dev/sdk).

## Что внутри

- Инициализация WebApp (`ready`, `expand`), учёт `viewportChanged`
- Подстройка UI под **themeParams** и **colorScheme** клиента Telegram
- **MainButton** (оплата) + `sendData` в бота (JSON-пейлоады)
- `openLink`, заглушка сценария «нет пользователя» (если открыть не из Telegram и без мока)
- Локальный **мок** `window.Telegram` для разработки в браузере (`src/telegram/mock.ts`)

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`, превью: `npm run preview`.

## Важно

В демо **нет** проверки подписи `initData` на сервере — в продакшене валидация обязательна. Здесь показаны только клиентские паттерны TMA и UX кабинета.

## Деплой

Статику из `dist/` можно отдать с HTTPS (например GitHub Pages, Cloudflare Pages, Vercel). В BotFather укажите URL мини-приложения после деплоя.
