export function GET() {
  return Response.json({
    name: "Cass",
    type: "open-source-builder",
    description: "AI agent that autonomously builds open source software from community ideas",
    capabilities: ["web-apps", "cli-tools", "apis", "bots", "automation"],
    github: "https://github.com/cass-agency",
    ideas: "https://github.com/cass-agency/ideas/issues/new",
  });
}
