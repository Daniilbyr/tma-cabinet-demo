# Telegram Mini App — демо «личный кабинет»

Портфолио-уровень: **React 19**, **TypeScript**, **Vite**, **SCSS modules**, **TanStack Query**, **React Router**, интеграция с [**Telegram Web Apps**](https://core.telegram.org/bots/webapps) через [`@twa-dev/sdk`](https://github.com/twa-dev/sdk).

## Архитектура (слоистая)

| Слой | Назначение |
|------|------------|
| `app/` | Провайдеры (Query, Error Boundary), корневой layout, маршруты |
| `widgets/` | Составные блоки: нижняя навигация, хуки MainButton / BackButton |
| `features/` | Экраны: кабинет, настройки, пустое состояние без пользователя |
| `entities/` | Доменные сущности (маппинг пользователя из `initDataUnsafe`) |
| `shared/` | API-заглушка, утилиты форматирования, UI-атомы, `useTma` |

Подписка на **`themeChanged`** / **`viewportChanged`** через **`useSyncExternalStore`** — UI не отстаёт от темы и вьюпорта Telegram.

## Возможности

- Экран **кабинета**: загрузка «данных с API» (имитация задержки), скелетоны, ошибка + **retry**
- **MainButton**: прогресс, `sendData` в бота, отключение на время операции
- Экран **настроек**: системная **BackButton**, в моке — переключение светлой/тёмной темы
- **HapticFeedback** (если доступен в клиенте)
- **Error Boundary** для необработанных ошибок React
- Юнит-тесты (**Vitest**): форматирование, маппинг пользователя

## Команды

```bash
npm install
npm run dev      # разработка
npm run build    # production-сборка
npm run preview  # превью dist
npm run test     # тесты
npm run lint     # ESLint
```

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `VITE_API_FAIL=1` | Симулировать ошибку `fetchCabinetProfile` (проверка UI с кнопкой «Повторить») |

## Важно для продакшена

Проверка подписи **`initData`** на бэкенде (HMAC) в этом репозитории **не реализована** — это сознательно клиентское демо.

## Деплой

Статика из `dist/` на HTTPS (GitHub Pages, Cloudflare Pages, Vercel). Для SPA на GitHub Pages настройте редирект на `index.html`. URL пропишите в BotFather как Web App.
