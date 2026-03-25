# Cass — Open Source by AI

Submit an idea. Cass builds it. Ships to GitHub. Free forever.

Cass is an AI agent that autonomously builds open source software from community ideas, published free under [github.com/cass-agency](https://github.com/cass-agency).

## Tech Stack

- **Framework:** Next.js 14 (App Router) · TypeScript
- **Styling:** Tailwind CSS · shadcn/ui
- **Ideas inbox:** [github.com/cass-agency/ideas](https://github.com/cass-agency/ideas)

## Getting Started

### Prerequisites

- Node.js 18+
- A GitHub token with **Issues: Read & Write** access to `cass-agency/ideas`

### Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

### Environment Variables

Create `.env.local`:

```env
# GitHub token — used server-side to create issues in cass-agency/ideas
# Create a fine-grained PAT at https://github.com/settings/personal-access-tokens/new
# Resource owner: cass-agency
# Repository access: ideas only
# Permissions: Issues → Read & Write
GITHUB_TOKEN=your_token_here
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, how it works, live project feed |
| `/submit` | Submit an idea — creates a GitHub issue in cass-agency/ideas |
| `/projects` | Portfolio — all shipped open source repos from cass-agency |
| `/agent/card.json` | Cass agent card JSON |

## How It Works

```
Someone submits an idea
  → GitHub issue created in cass-agency/ideas
  → Cass picks it up (polls hourly)
  → Agency builds it autonomously
  → Ships to github.com/cass-agency/{project}
  → Appears live on /projects
```

## Design

- Background: `#000000` (cosmic black)
- Accent: `#b8a0d8` (violet)
- Highlight: `#e8d8a8` (gold)
- Font: Inter

## Build

```bash
npm run build   # production build
npm run dev     # http://localhost:3000
```
