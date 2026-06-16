[![GitHub repo size](https://img.shields.io/github/repo-size/LucasHARosa/APP-Daily-Diet)](https://github.com/LucasHARosa/APP-Daily-Diet)
[![GitHub language count](https://img.shields.io/github/languages/count/LucasHARosa/APP-Daily-Diet)](https://github.com/LucasHARosa/APP-Daily-Diet)
[![GitHub top language](https://img.shields.io/github/languages/top/LucasHARosa/APP-Daily-Diet)](https://github.com/LucasHARosa/APP-Daily-Diet)
[![GitHub last commit](https://img.shields.io/github/last-commit/LucasHARosa/APP-Daily-Diet)](https://github.com/LucasHARosa/APP-Daily-Diet)

# Daily Diet

A React Native app to track daily meals and monitor diet progress — built with Expo and a clean, opinionated mobile stack.

> **Status:** All screens implemented with mock data. Ready for API integration.

---

## 📱 Demo

<div align="center">
  <img src=".github/assets/demo.gif" alt="App demo" width="300"/>
</div>

---

## 🖼️ Screenshots

<div align="center">
  <img src=".github/assets/screen-home.png" alt="Home" width="200"/>
  &nbsp;
  <img src=".github/assets/screen-stats.png" alt="Statistics" width="200"/>
  &nbsp;
  <img src=".github/assets/screen-plan.png" alt="Food Plan" width="200"/>
  &nbsp;
  <img src=".github/assets/screen-profile.png" alt="Profile" width="200"/>
</div>

---

## Features

- **Authentication** — Sign in / sign up with secure token storage via `expo-secure-store`
- **Meal Tracking** — Create, view, edit and delete meals with on-diet / off-diet status
- **Diet Feedback** — Visual feedback screen after logging a meal ("Continue assim!" / "Que pena!")
- **Statistics** — Streak tracking, totals, period filter (Today / 7 days / 30 days / Custom)
- **Food Plan** — Weekly planner (Mon–Sun) with planned meals and calorie targets per day
- **Health Profile** — Physical metrics form with real-time BMR and TDEE calculation (Mifflin-St Jeor)
- **Toast Notifications** — Non-blocking animated toasts for every async action (success / error / info)
- **Pull-to-Refresh** — On the home screen meal list
- **Show/Hide Password** — Toggle on all password fields

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Expo + expo-router | 56 / v4 |
| Styling | NativeWind (Tailwind CSS for RN) | v4 |
| Server state | TanStack Query | v5 |
| Forms + validation | React Hook Form + Zod | — / v4 |
| Client state | Zustand | — |
| HTTP client | Axios | — |
| Token storage | expo-secure-store | — |
| Icons | lucide-react-native | — |
| Font | Nunito Sans (Google Fonts) | 400 / 500 / 600 / 700 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- Android emulator / iOS simulator, or the [Expo Go](https://expo.dev/go) app on a physical device

### Install

```bash
cd mobile-daily-diet
npm install
```

### Environment

Create a `.env` file at `mobile-daily-diet/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3333
```

> The app runs entirely on mock data right now — this variable is only needed once API integration begins.

### Run

```bash
npm start          # start Metro bundler + QR code for Expo Go
npm run android    # open on Android emulator
npm run ios        # open on iOS simulator
```

---

## Screens

| Route | Screen | Description |
|---|---|---|
| `/(auth)/sign-in` | Sign In | Email + password, show/hide toggle, mock auth |
| `/(auth)/sign-up` | Sign Up | Name + email + password, mock registration |
| `/(tabs)/` | Home | Diet percentage card, meal list grouped by date |
| `/(tabs)/meals` | Meals | Placeholder — reserved for filtered meal list |
| `/(tabs)/plan` | Food Plan | Weekly planner with day selector and meal cards |
| `/(tabs)/profile` | Profile | Health metrics form, BMR/TDEE calculator, logout |
| `/stats` | Statistics | Percentage header, general stats, period breakdown |
| `/meals/new` | New Meal | Create form + diet feedback screen |
| `/meals/[id]` | Meal Detail | View meal, themed by diet status |
| `/meals/[id]/edit` | Edit Meal | Pre-filled edit form |

---

## Project Structure

```
mobile-daily-diet/
├── app/                        # expo-router file-based routes
│   ├── _layout.tsx             # root Stack + auth redirect + Toast
│   ├── index.tsx               # redirects to /(tabs) or /(auth)
│   ├── stats.tsx               # statistics screen (stack, not tab)
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx         # bottom tab navigator
│   │   ├── index.tsx           # home
│   │   ├── meals.tsx
│   │   ├── plan.tsx
│   │   └── profile.tsx
│   └── meals/
│       ├── new.tsx
│       └── [id]/
│           ├── index.tsx       # detail
│           └── edit.tsx
│
└── src/
    ├── components/             # shared UI primitives
    │   ├── Button.tsx          # primary / secondary, isLoading, icon
    │   ├── Input.tsx           # label + focus border + rightElement slot
    │   ├── DietToggle.tsx      # Sim / Não toggle (green / red)
    │   └── Toast.tsx           # animated overlay, 3 variants
    │
    ├── stores/
    │   ├── auth-store.ts       # Zustand: token, user, login(), logout(), hydrate()
    │   └── toast-store.ts      # Zustand: show(), hide(), useToast() hook
    │
    ├── services/
    │   ├── api.ts              # Axios instance + Bearer token interceptor
    │   └── query-client.ts     # TanStack QueryClient singleton
    │
    └── global.css              # Tailwind base + Nunito Sans default
```

---

## Design System

The app uses a green/red color system driven by diet status:

| State | Background | Text | Dot |
|---|---|---|---|
| On-diet | `greenLight` `#E5F0DB` | `greenDark` `#639339` | `greenMid` |
| Off-diet | `redLight` `#F4E6E7` | `redDark` `#BF3B44` | `redMid` |
| Neutral | `gray6` `#EFF0F0` | `gray1` `#1B1D1E` | `gray4` |

**Percentage rule:** card on home shows green if ≥ 70% of meals are on-diet, red otherwise.

**Fonts:** Nunito Sans loaded with 4 explicit weights (`_400Regular`, `_500Medium`, `_600SemiBold`, `_700Bold`) and mapped to Tailwind classes (`font-sans`, `font-sans-md`, `font-sans-sb`, `font-sans-bd`). Explicit families are required on Android — `fontWeight` alone doesn't switch font files.

---

## Architecture Notes

**Routing** lives entirely in `app/`. The `src/` directory holds all non-route logic (components, stores, services). The `@/*` alias maps to `./src/*`.

**Auth flow** — `_layout.tsx` hydrates the Zustand store from SecureStore on startup, then redirects based on `isAuthenticated`. The `<Toast />` component is rendered above the Stack navigator so toasts persist across navigation transitions.

**Mock data** — All screens use local mock constants. Every async action has a `setTimeout` delay to simulate network latency and display the loading state on buttons. Swap in real API calls by replacing the mock in each `onSubmit` / `onRefresh` handler with the corresponding `api.*` call.

**Toast** — The `useToast()` hook exposes a single `toast(message, type?)` function backed by a Zustand store. The animated `<Toast />` component reads from this store and is independent of the screen tree.

---

## API Integration Checklist

When the backend is ready, replace mocks in this order:

- [ ] `app/(auth)/sign-in.tsx` → `POST /sessions`
- [ ] `app/(auth)/sign-up.tsx` → `POST /users`
- [ ] `app/(tabs)/index.tsx` → `GET /metrics/summary` + `GET /meals`
- [ ] `app/meals/new.tsx` → `POST /meals`
- [ ] `app/meals/[id]/index.tsx` → `GET /meals/:id` + `DELETE /meals/:id`
- [ ] `app/meals/[id]/edit.tsx` → `GET /meals/:id` + `PUT /meals/:id`
- [ ] `app/stats.tsx` → `GET /metrics/summary` + `GET /metrics?start=...&end=...`
- [ ] `app/(tabs)/plan.tsx` → `GET /food-plans/active`
- [ ] `app/(tabs)/profile.tsx` → `GET /me/profile` + `PATCH /me/profile`

> See [`ROADMAP.md`](../ROADMAP.md) for the full API reference and hook patterns.

---

<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) &nbsp;
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)

</div>
