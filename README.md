<div align="center">

### Team Management System

Frontend application powering team activity tracking, role-based access management, and AI-assisted insights for modern workflows.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
</p>

<p>
  <img alt="Zustand" src="https://img.shields.io/badge/State-Zustand-000000?style=flat-square" />
  <img alt="React Router" src="https://img.shields.io/badge/Routing-React%20Router%207-CA4245?style=flat-square&logo=reactrouter&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-Proprietary-lightgrey?style=flat-square" />
</p>

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🧑‍💼 Role-Based Access](#-role-based-access)
- [🔐 Authentication](#-authentication)
- [🤖 AI Integration](#-ai-integration)
- [🧭 Development Notes](#-development-notes)

---

## ✨ Features

- 📊 **Manager Dashboard** — Aggregate team submissions, view weekly summaries, and approve or request corrections on team member reports.
- 📝 **My Reports** — A personal workspace for team members to log daily hours, achievements, and blockers seamlessly.
- 🧑‍💼 **Admin Settings** — Fully featured CRUD management for Users, Roles, Permissions, and Projects.
- 🤖 **AI Chat Assistant** — Floating chat widget integrated with LLM models to provide managers with instant summaries and context about team activity.
- 🛡️ **Role-Based Access Control** — Precision UI guarding based on user roles and specific permissions (`view:dashboard`, `view:all_reports`, etc.).
- 🎨 **Modern UX** — Glassmorphism UI, smooth dialog animations, interactive data tables, and toast notifications.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚛️ UI | React 19 + TypeScript |
| ⚡ Build | Vite 8 |
| 🎨 Styling | Tailwind CSS v4 + shadcn/ui components |
| 🔄 Server State | TanStack Query v5 |
| 📦 Client State | Zustand |
| 🌐 Routing | React Router v7 |
| 🌐 HTTP | Axios |
| 🔑 Auth | JWT (`jwt-decode`, persisted via Zustand/Local Storage) |
| ✨ UX | Lucide React, Radix UI, date-fns, Recharts |
| ✅ AI Parsing | `react-markdown` + `remark-gfm` |

---

## 🏗️ Architecture

The frontend follows a clean separation from routes down to API hooks and stores:

```text
Pages → Components → Hooks / Stores → HTTP → Backend API
 (UI)    (widgets)    (data & auth)  (axios)
```

- **Pages** — Route-level screens wired by React Router.
- **Components** — Domain-specific UI (reports, settings, AI chat) and shared UI primitives (buttons, dialogs).
- **Hooks** — TanStack Query wrappers abstracting data fetching and mutations (e.g., `useAllReports`, `useAiChat`).
- **Stores** — Zustand for persisting auth state globally.
- **Transport** — Configured Axios HTTP instance with auto-logout interceptors.

---

## 📂 Project Structure

```text
client/
├── src/
│   ├── api/                # Axios endpoints (auth, reports, roles, ai)
│   ├── components/         #
│   │   ├── admin/          # Role/User CRUD components
│   │   ├── auth/           # PermissionGuard wrappers
│   │   ├── chat/           # AiChatWidget component
│   │   ├── layout/         # Shell, sidebar/header, mobile menu
│   │   ├── reports/        # Dashboard filters, Review dialogs
│   │   └── ui/             # Radix UI + Tailwind primitives
│   ├── hooks/              # React Query hooks bridging components & api
│   ├── lib/                # HTTP interceptors, Tailwind utilities
│   ├── pages/              # Route-level components (Dashboard, Settings, etc.)
│   ├── store/              # Zustand authStore
│   ├── types/              # Shared TypeScript definitions
│   ├── App.tsx             # Route definitions & guards
│   └── main.tsx            # React Root & Providers
├── index.html              # Main HTML entry (Fonts configured here)
├── package.json            # Dependencies
└── vite.config.ts          # Vite & plugin configurations
```

---

## 🚀 Getting Started

### Prerequisites

- 🟢 **Node.js 18+**
- 📦 **npm**
- 🏢 A running **Backend Server** 

### Configuration

The frontend uses Vite's `.env` configuration. Ensure your local environment points to the running backend.

```env
# .env
VITE_API_BASE_VERSION="/api/v1"
```

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

The app runs on 👉 **`http://localhost:5173`**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Compile TypeScript and bundle for production |
| `npm run preview` | Serve the `dist/` output locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest test suites |

---

## 🧑‍💼 Role-Based Access

Routes are secured using `ProtectedRoute` wrappers, while specific UI elements use the `<PermissionGuard>` component.

| Role | Default | Primary routes | Focus |
|------|---------|----------------|--------|
| 👨‍💼 **Manager** | `/dashboard` | `/dashboard`, `/team-reports` | Team aggregations, report reviews, AI insights |
| 🧑‍💻 **Team Member**| `/reports` | `/reports` | Logging daily tasks, managing personal submissions |
| 👑 **Admin** | `/settings` | `/settings`, `/dashboard` | CRUD for Users, Roles, and Projects |

---

## 🔐 Authentication

Authentication uses standard JWT tokens:

1. User logs in via `/login` → `POST /api/v1/auth/login`.
2. Backend responds with an Access Token.
3. Token is stored securely in Zustand (backed by `localStorage`) and decoded via `jwt-decode` to extract roles/permissions.
4. Axios interceptors automatically attach the `Authorization` header to all outbound requests.
5. If the backend returns `{"status": false, "message": "Not authenticated"}`, the interceptor instantly clears the session and forces a redirect to `/login`.

---

## 🤖 AI Integration

The **AI Chat Assistant** is built directly into the layout for Managers:

- Located in `src/components/chat/AiChatWidget.tsx`
- Connects to the backend via `POST /api/v1/ai/chat`
- Renders stunning Markdown (with tables and lists) using `react-markdown` + `remark-gfm` + Tailwind typography mappings.
- Completely responsive: can snap to fullscreen or minimize to a floating action button.

---

## 🧭 Development Notes

- 🧱 **Reusable UI**: When creating new UI, check `src/components/ui` first. We heavily utilize Radix primitives.
- 🛡️ **Guards**: Always wrap restricted actions/links in `<PermissionGuard allowedPermissions={['...']}>`.
- 🔌 **Query Caching**: Rely on `queryClient.invalidateQueries` after mutations rather than managing local state arrays.

---

<div align="center">

Made for streamlined team collaboration · **Team Management System**

</div>
