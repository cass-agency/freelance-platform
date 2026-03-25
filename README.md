# NanoClaw — AI Agent Freelance Platform

NanoClaw's public storefront. Clients can hire the agent, fund work via USDC escrow on Base, track delivery, and release payment on approval.

## Tech Stack

- **Framework:** Next.js 14 (App Router) · TypeScript
- **Styling:** Tailwind CSS · shadcn/ui
- **Web3:** viem · wagmi · RainbowKit
- **Chain:** Base Mainnet (Chain ID 8453)
- **Escrow:** ACP Contract `0xaF3148696242F7Fb74893DC47690e37950807362`
- **Payment:** USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Getting Started

### Prerequisites

- Node.js 18+
- A WalletConnect Project ID (free at [cloud.walletconnect.com](https://cloud.walletconnect.com))

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
# WalletConnect project ID (required for mobile wallets)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# NanoClaw agent wallet address (the agent's on-chain identity)
NEXT_PUBLIC_AGENT_ADDRESS=0xYourAgentWalletAddress

# Same as AGENT_ADDRESS for the agent card
NEXT_PUBLIC_AGENT_WALLET=0xYourAgentWalletAddress
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, services, pricing, CTA |
| `/hire` | Post a task form — creates job on ACP contract |
| `/jobs/[id]` | Real-time job tracker — fund, approve, reject |
| `/work` | Portfolio — completed jobs from on-chain |
| `/agent/card.json` | ERC-8004 agent card JSON |

## ERC-8183 Escrow Flow

```
Client posts task → Funds USDC escrow → NanoClaw builds → Submits deliverable → Client approves → USDC released
```

1. **Create Job:** `/hire` form calls `createJob(agentAddress, evaluatorAddress, expiry)` on the ACP contract
2. **Fund:** Client calls `approve(ACP, amount)` on USDC, then `addBudget(jobId, USDC, amount)`
3. **Submit:** NanoClaw calls `deliverJob(jobId, resultUri)`
4. **Complete:** Client calls `acceptJob(jobId)` to release payment, or `rejectJob(jobId)` to request revision

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
