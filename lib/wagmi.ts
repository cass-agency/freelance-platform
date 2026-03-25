import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

export const ACP_CONTRACT = "0xaF3148696242F7Fb74893DC47690e37950807362" as const;
export const USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

export const wagmiConfig = getDefaultConfig({
  appName: "NanoClaw",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "nanoclaw-dev",
  chains: [base],
  ssr: true,
});

// ERC-8183 ACP Contract ABI (relevant subset)
export const ACP_ABI = [
  {
    name: "createJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentAddress", type: "address" },
      { name: "evaluatorAddress", type: "address" },
      { name: "expiry", type: "uint256" },
    ],
    outputs: [{ name: "jobId", type: "uint256" }],
  },
  {
    name: "addBudget",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "deliverJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "result", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "acceptJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "rejectJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getJob",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "jobId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "client", type: "address" },
          { name: "agent", type: "address" },
          { name: "evaluator", type: "address" },
          { name: "state", type: "uint8" },
          { name: "expiry", type: "uint256" },
          { name: "resultUri", type: "string" },
        ],
      },
    ],
  },
  {
    name: "JobCreated",
    type: "event",
    inputs: [
      { name: "jobId", type: "uint256", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "agent", type: "address", indexed: true },
    ],
  },
] as const;

export const USDC_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

// Job states from ERC-8183
export enum JobState {
  Open = 0,
  Funded = 1,
  Submitted = 2,
  Completed = 3,
  Rejected = 4,
  Expired = 5,
}

export const JOB_STATE_LABELS: Record<number, string> = {
  [JobState.Open]: "Open",
  [JobState.Funded]: "Funded",
  [JobState.Submitted]: "Submitted",
  [JobState.Completed]: "Completed",
  [JobState.Rejected]: "Rejected",
  [JobState.Expired]: "Expired",
};

export const JOB_STATE_COLORS: Record<number, string> = {
  [JobState.Open]: "text-gold border-gold/40 bg-gold/10",
  [JobState.Funded]: "text-violet border-violet/40 bg-violet/10",
  [JobState.Submitted]: "text-blue-400 border-blue-400/40 bg-blue-400/10",
  [JobState.Completed]: "text-green-400 border-green-400/40 bg-green-400/10",
  [JobState.Rejected]: "text-red-400 border-red-400/40 bg-red-400/10",
  [JobState.Expired]: "text-gray-400 border-gray-400/40 bg-gray-400/10",
};

// NanoClaw agent wallet address — set NEXT_PUBLIC_AGENT_ADDRESS in env
const _agentAddr = process.env.NEXT_PUBLIC_AGENT_ADDRESS;
if (!_agentAddr) {
  console.warn(
    "[NanoClaw] NEXT_PUBLIC_AGENT_ADDRESS is not set. Jobs will be created with a zero-address agent and will not route correctly."
  );
}
export const NANOCLAW_AGENT_ADDRESS =
  (_agentAddr as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";
