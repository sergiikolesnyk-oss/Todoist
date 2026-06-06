# AI-планер дня

Mobile-first todo-застосунок: користувач вивантажує все, що в голові, а AI
(згодом) перетворює це на структуровані задачі.

> Поточний стан — **каркас без AI**: 3 екрани, нижня таб-навігація, стан на
> клієнті (React Context + `localStorage`). Без бекенду.

## Екрани

- **Capture** — велике поле «Що в голові?» + велика кнопка мікрофона (заглушка).
  Кожен рядок при збереженні стає окремою задачею в Inbox.
- **Inbox** — список задач. Кнопка «На сьогодні» переносить задачу в Today.
- **Today** — чекліст задач на сьогодні з відмічанням виконання.

## Стек

Next.js 15 (App Router) · React 19 · TypeScript · чистий CSS (без UI-бібліотек).

## Запуск локально

Потрібен **Node.js 18.18+** (рекомендовано 20+).

```bash
npm install
npm run dev
```

Відкрий http://localhost:3000 (краще — у мобільному вигляді DevTools).

## Скрипти

- `npm run dev` — режим розробки
- `npm run build` — продакшн-збірка
- `npm run start` — запуск продакшн-збірки

## Структура

```
src/
  app/
    layout.tsx        # корінь, провайдер стану + таб-навігація
    page.tsx          # Capture (/)
    inbox/page.tsx    # Inbox (/inbox)
    today/page.tsx    # Today (/today)
    globals.css       # стилі (mobile-first)
  components/
    TabBar.tsx        # нижня навігація
    EmptyState.tsx
  lib/
    store.tsx         # стан задач + localStorage
    types.ts
```
