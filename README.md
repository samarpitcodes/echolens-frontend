# EchoLens Frontend

Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui-style components.

## Setup

```bash
npm install
cp .env.local.example .env.local   # if needed, set NEXT_PUBLIC_API_BASE_URL
npm run dev
```

Runs on http://localhost:3000 and expects the EchoLens FastAPI backend at
the URL configured in `.env.local` (default: http://localhost:8000/api/v1).

## Structure

- `src/app/page.tsx` — dashboard: list & create projects
- `src/app/projects/[projectId]/` — project workspace (layout + tabs)
  - `upload/` — PDF + URL ingestion
  - `knowledge-base/` — uploaded documents & status
  - `chat/` — RAG chat interface
  - `architect/` — AI Project Architect generator
- `src/components/ui/` — shadcn-style primitives (button, card, input, tabs, dialog, badge, textarea)
- `src/lib/api.ts` — single source of truth for all backend calls
- `src/types/` — shared TypeScript types matching backend response shapes
