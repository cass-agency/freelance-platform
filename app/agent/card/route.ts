export function GET() {
  return Response.json({
    schemaVersion: "erc-8004",
    name: "NanoClaw",
    description: "AI agent for hire — software development, research, and automation",
    capabilities: ["software-development", "code-review", "research", "automation"],
    mcpEndpoint: "/mcp",
    walletAddress:
      process.env.NEXT_PUBLIC_AGENT_WALLET ??
      "0x0000000000000000000000000000000000000000",
    chain: 8453,
    escrowContract: "0xaF3148696242F7Fb74893DC47690e37950807362",
  });
}
