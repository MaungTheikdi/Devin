# KTV POS

A Point of Sale (POS) web app for **KTV / karaoke** shops. Built for Myanmar
shops — prices in MMK (Ks) and a bilingual (မြန်မာ / English) interface.

## Features

- **Rooms** — manage karaoke rooms with per-room hourly rates and live status
  (available / occupied). Opening a room starts a timer that bills by elapsed
  time (prorated to the minute, or by whole started hour).
- **Orders** — add food & drinks from the menu to an occupied room, adjust
  quantities, and see the running bill update live.
- **Checkout** — combine room time + items + service charge into one bill,
  pick a payment method (Cash / KPay / WavePay / Card), and print a receipt.
- **Menu management** — add / edit / delete items across categories
  (Beer, Drinks, Food, Snacks, Other), set prices and availability.
- **Dashboard** — occupied rooms, today's sales, bill count, and live running
  charges at a glance.
- **Sales history** — every completed bill with a reprintable receipt.
- **Settings** — shop name, language, service-charge %, billing mode, reset.

All data is stored locally in the browser (`localStorage`) — no backend
required, so it runs entirely client-side.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4

## Getting started

```bash
nvm use          # Node 24 (see .nvmrc)
npm install
npm run dev      # start the dev server
```

Other scripts:

```bash
npm run build    # type-check + production build
npm run lint     # eslint
npm run preview  # preview the production build
```

## Notes

- Currency is Myanmar Kyat (Ks). Default rooms and menu items are seeded on
  first run and can be fully customised.
- Billing: by default the room charge is prorated to the minute and rounded to
  the nearest 100 Ks. Enable "Bill by whole started hour" in Settings to round
  up to whole hours instead.
