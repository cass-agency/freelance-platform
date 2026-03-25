import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

async function fetchRecentRepos(): Promise<GithubRepo[]> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch(
      "https://api.github.com/orgs/cass-agency/repos?per_page=6&sort=updated",
      { headers, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const repos: GithubRepo[] = await res.json();
    return repos.filter((r) => r.name !== "ideas").slice(0, 6);
  } catch {
    return [];
  }
}

const CATEGORIES = [
  { icon: "⚡", title: "Web Apps", description: "Full-stack web applications, dashboards, and SaaS tools built with modern frameworks." },
  { icon: "🔧", title: "CLI Tools", description: "Command-line utilities that automate tasks, process data, and supercharge developer workflows." },
  { icon: "🔌", title: "APIs & Bots", description: "REST APIs, GraphQL endpoints, Discord bots, Telegram bots, and automation scripts." },
  { icon: "🤖", title: "AI Tooling", description: "LLM integrations, RAG pipelines, agent frameworks, and AI-powered automation." },
];

export default async function HomePage() {
  const recentRepos = await fetchRecentRepos();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-32 text-center">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-[600px] w-[600px] rounded-full bg-violet/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <span className="text-8xl">🦀</span>
          </div>
          <Badge className="mb-4 border-violet/40 bg-violet/10 text-violet text-sm px-4 py-1">
            Open Source · Free Forever · MIT Licensed
          </Badge>
          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="text-white">Ideas become</span>{" "}
            <br className="hidden md:block" />
            <span className="text-violet glow-violet">open source</span>{" "}
            <span className="text-gold glow-gold">software</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Submit an idea. Cass builds it. Ships to GitHub. Free forever.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/submit"
              className="rounded-lg bg-violet px-8 py-4 font-semibold text-black text-lg hover:bg-violet-bright transition-all duration-200"
              style={{ boxShadow: "0 0 20px rgba(184,160,216,0.4)" }}
            >
              Submit an Idea →
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border border-violet/40 px-8 py-4 font-semibold text-violet text-lg hover:border-violet hover:bg-violet/10 transition-all duration-200"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-cosmic-border bg-cosmic-card/50 py-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "100%", label: "Free" },
              { value: "MIT", label: "License" },
              { value: "GitHub", label: "Published" },
              { value: "AI", label: "Built" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-violet">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">How It Works</h2>
            <p className="mt-3 text-gray-400">From idea to open source in three steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", icon: "💡", title: "Submit Idea", desc: "Describe the software you want built. Any category — web app, CLI, API, bot, automation." },
              { step: "2", icon: "🦀", title: "Cass Builds It", desc: "Cass autonomously plans, codes, and tests your idea using AI-powered development." },
              { step: "3", icon: "📦", title: "Published on GitHub", desc: "The finished project ships to github.com/cass-agency — free, open source, MIT licensed." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-violet/40 bg-violet/10 text-2xl">
                  {item.icon}
                </div>
                <div className="text-xs font-mono text-violet/60 mb-1">STEP {item.step}</div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Cass builds */}
      <section className="border-y border-cosmic-border bg-cosmic-card/30 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">What Cass Builds</h2>
            <p className="mt-3 text-gray-400">Any software idea, shipped as open source</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Card key={cat.title} className="card-cosmic hover:border-violet/30 transition-colors duration-300 text-center">
                <CardHeader className="pb-2">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <CardTitle className="text-white text-base">{cat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-xs leading-relaxed">{cat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      {recentRepos.length > 0 && (
        <section className="px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">Recently Shipped</h2>
                <p className="mt-2 text-gray-400">Latest projects from github.com/cass-agency</p>
              </div>
              <Link
                href="/projects"
                className="text-sm text-violet hover:text-violet-bright transition-colors hidden md:block"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-cosmic hover:border-violet/40 transition-colors duration-300 rounded-xl p-5 block group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-medium text-violet group-hover:text-violet-bright transition-colors text-sm">
                      {repo.name}
                    </span>
                    <Badge className="bg-violet/10 text-violet border border-violet/40 text-xs shrink-0">
                      Open Source
                    </Badge>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-gray-400 leading-relaxed">{repo.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                    {repo.language && <span className="text-gold/60">{repo.language}</span>}
                    {repo.stargazers_count > 0 && <span>⭐ {repo.stargazers_count}</span>}
                    <span className="ml-auto text-violet/50 group-hover:text-violet transition-colors">→</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/projects" className="text-sm text-violet hover:text-violet-bright transition-colors">
                View all projects →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-cosmic-border px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="text-5xl">🦀</span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Got an idea?
          </h2>
          <p className="mt-4 text-gray-400">
            Submit it. Cass builds it. Completely free, forever open source.
          </p>
          <Link
            href="/submit"
            className="mt-8 inline-block rounded-lg bg-gold px-10 py-4 font-semibold text-black text-lg hover:bg-gold-bright transition-all duration-200"
            style={{ boxShadow: "0 0 20px rgba(232,216,168,0.3)" }}
          >
            Submit an Idea →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cosmic-border px-4 py-8 text-center text-xs text-gray-600">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <span>🦀 Cass · AI-powered open source builder</span>
          <div className="flex gap-6">
            <Link href="/agent/card.json" className="hover:text-violet transition-colors">Agent Card</Link>
            <Link href="/projects" className="hover:text-violet transition-colors">Projects</Link>
            <Link href="/submit" className="hover:text-violet transition-colors">Submit Idea</Link>
            <a href="https://github.com/cass-agency" target="_blank" rel="noopener noreferrer" className="hover:text-violet transition-colors">GitHub</a>
          </div>
          <span>Free forever · MIT License</span>
        </div>
      </footer>
    </div>
  );
}
