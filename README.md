# Savr

A personal finance management mobile/web app built with Ionic + Angular that connects to your bank accounts via Plaid and gives you real-time visibility into spending, budgets, goals, and investments — all in one place.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 11 + Ionic 5 |
| Mobile | Capacitor (iOS/Android) |
| UI Components | PrimeNG, Kendo Angular Gauges, FontAwesome |
| Charts | Chart.js with datalabels plugin |
| Bank Integration | Plaid (ngx-plaid-link) |
| Encryption | SJCL (Stanford JS Crypto Library) |
| Language | TypeScript |

## Why It's Valuable

Most budgeting apps are read-only dashboards. Savr combines live bank data with active financial planning tools — budgets, goals, portfolio tracking, smart shopping, and event planning — in a single cross-platform app that runs natively on iOS, Android, and the web.

## Key Features

- **Bank Account Sync** — Plaid integration for real-time transaction ingestion across multiple accounts
- **Budget Breakdown** — Category-level spend tracking with gauge charts and datalabel annotations
- **Goals Tracking** — Set and monitor savings goals with visual progress indicators
- **Portfolio View** — Investment portfolio overview alongside cash accounts
- **Trade Trainer** — Educational trading practice module
- **Smart Shopping** — Shopping list and deal analysis tooling
- **Event Planning** — Budget-aware event cost planning
- **Client-side Encryption** — SJCL used for sensitive local data
- **Cross-platform** — Single codebase targets iOS, Android, and web via Capacitor

## Architecture Overview

```
Savr-UI/
├── src/app/
│   ├── pages/              # Feature screens (home, breakdown, goals, portfolio,
│   │                       #   settings, trade-trainer, smart-shopping, event-planning)
│   ├── services/           # REST API, encryption, auth token, foundation services
│   ├── modals/             # Overlay/dialog components
│   ├── models/             # Shared TypeScript interfaces/models
│   ├── reusable-modules/   # Shared UI components
│   ├── interceptors/       # HTTP interceptors (auth headers, error handling)
│   └── route-guards/       # Auth guards for protected routes
├── capacitor.config.json   # Native mobile config
└── ionic.config.json       # Ionic project config
```

The app communicates with a REST backend for account data and transactions. Local sensitive data is encrypted via SJCL before being stored in Ionic Storage.

## Getting Started

### Prerequisites

- Node.js 14+
- Angular CLI: `npm install -g @angular/cli`
- Ionic CLI: `npm install -g @ionic/cli`

### Install Dependencies

```bash
npm install
```

### Run in Browser

```bash
npm start
# or
ionic serve
```

Open `http://localhost:8100`

### Run in Production Mode (Browser)

```bash
npm run ionic-prod
# serves on port 8080
```

### Build for Web Deployment

```bash
npm run build-ng-prod
```

### Build for Native Mobile (Capacitor)

```bash
npm run build-ionic-prod
npx cap sync
npx cap open ios     # or android
```

## Environment Variables

Configure these in your backend service (not in this repo):

- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV`
- `API_BASE_URL`
- `JWT_SECRET`
