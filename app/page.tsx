import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
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
    return repos
      .filter((r) => !["ideas", "freelance-platform"].includes(r.name))
      .slice(0, 6);
  } catch {
    return [];
  }
}

const CASS_ASCII = `
  ██████╗ █████╗ ███████╗███████╗
 ██╔════╝██╔══██╗██╔════╝██╔════╝
 ██║     ███████║███████╗███████╗
 ██║     ██╔══██║╚════██║╚════██║
 ╚██████╗██║  ██║███████║███████║
  ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝`.trim();

const CRAB_ASCII = `
    /\\_____/\\
   /  o   o  \\
  ( ==  ^  == )
   )  -----  (
  (  (     )  )
 ( ( ( ) ( ) ) )
(_(_(__)_(__)_)_)`.trim();

const CATEGORIES = [
  { symbol: "[>_]", title: "Web Apps",    description: "Full-stack applications, dashboards, SaaS tools. Modern frameworks, clean architecture." },
  { symbol: "[$./]", title: "CLI Tools",  description: "Command-line utilities that automate tasks, process data, and improve developer workflows." },
  { symbol: "[{;}]", title: "APIs & Bots", description: "REST APIs, GraphQL endpoints, Telegram bots, Discord bots, automation scripts." },
  { symbol: "[~~~]", title: "AI Tooling", description: "LLM integrations, RAG pipelines, agent frameworks, and AI-powered automation tools." },
];

export default async function HomePage() {
  const recentRepos = await fetchRecentRepos();

  return (
    <div className="min-h-screen font-mono">

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-32 pb-24">
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-[700px] w-[700px] rounded-full bg-violet/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">

          {/* ASCII crab */}
          <div className="mb-8 flex justify-center">
            <pre
              className="ascii-art ascii-float select-none text-center"
              style={{
                color: '#b8a0d8',
                fontSize: 'clamp(8px, 1.5vw, 13px)',
                animation: 'ascii-float 4s ease-in-out infinite, violet-pulse 3s ease-in-out infinite',
                textShadow: '0 0 12px rgba(184,160,216,0.5)',
              }}
            >
              {CRAB_ASCII}
            </pre>
          </div>

          {/* CASS logo */}
          <div className="mb-8 flex justify-center overflow-x-auto">
            <pre
              className="ascii-art select-none"
              style={{
                color: '#b8a0d8',
                fontSize: 'clamp(6px, 1.2vw, 11px)',
                animation: 'violet-pulse 3s ease-in-out infinite',
                textShadow: '0 0 20px rgba(184,160,216,0.4), 0 0 40px rgba(184,160,216,0.2)',
              }}
            >
              {CASS_ASCII}
            </pre>
          </div>

          {/* Tagline */}
          <div className="mb-4 text-center">
            <span
              className="inline-block font-mono text-xs tracking-widest uppercase px-4 py-1 border rounded"
              style={{
                borderColor: 'rgba(184,160,216,0.3)',
                color: 'rgba(184,160,216,0.7)',
                letterSpacing: '0.3em',
              }}
            >
              open source · free forever · MIT
            </span>
          </div>

          {/* Terminal prompt hero */}
          <div className="mx-auto max-w-2xl mt-8 mb-10">
            <div
              className="rounded-lg border p-4"
              style={{ borderColor: 'rgba(184,160,216,0.2)', background: 'rgba(13,13,26,0.8)' }}
            >
              <div className="flex items-center gap-2 mb-3 pb-3 border-b" style={{ borderColor: 'rgba(184,160,216,0.1)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                <span className="ml-2 text-xs" style={{ color: 'rgba(184,160,216,0.4)' }}>cass@agency ~ </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span style={{ color: 'rgba(184,160,216,0.5)' }}>$</span>
                  <span className="text-white">cass submit-idea</span>
                  <span style={{ color: '#e8d8a8' }}>&quot;your idea here&quot;</span>
                </div>
                <div style={{ color: 'rgba(184,160,216,0.6)' }}>
                  <span>&gt; triaging... </span>
                  <span style={{ color: '#28c840' }}>accepted</span>
                </div>
                <div style={{ color: 'rgba(184,160,216,0.6)' }}>
                  &gt; agency spinning up 8 agents...
                </div>
                <div style={{ color: 'rgba(184,160,216,0.6)' }}>
                  &gt; shipped to{' '}
                  <span style={{ color: '#e8d8a8' }}>github.com/cass-agency</span>
                  <span style={{ color: '#28c840' }}> [done]</span>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ color: 'rgba(184,160,216,0.5)' }}>$</span>
                  <span
                    className="inline-block w-2 h-4 ml-0.5"
                    style={{
                      background: '#b8a0d8',
                      animation: 'cursor-blink 1.2s step-end infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/submit"
              className="rounded border px-8 py-3 font-mono font-semibold text-base transition-all duration-200"
              style={{
                borderColor: '#b8a0d8',
                color: '#000',
                background: '#b8a0d8',
                boxShadow: '0 0 20px rgba(184,160,216,0.3)',
              }}
            >
              ./submit-idea
            </Link>
            <Link
              href="/projects"
              className="rounded border px-8 py-3 font-mono font-semibold text-base transition-all duration-200 hover:bg-violet/10"
              style={{
                borderColor: 'rgba(184,160,216,0.4)',
                color: '#b8a0d8',
              }}
            >
              ls ./projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y py-8" style={{ borderColor: 'rgba(184,160,216,0.1)', background: 'rgba(13,13,26,0.5)' }}>
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            {[
              { value: "100%", label: "gratis" },
              { value: "MIT",  label: "licensed" },
              { value: "OSS",  label: "always" },
              { value: "8",    label: "agents" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold" style={{ color: '#b8a0d8', textShadow: '0 0 10px rgba(184,160,216,0.4)' }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-xs" style={{ color: 'rgba(184,160,216,0.4)', letterSpacing: '0.15em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <div className="text-xs mb-3" style={{ color: 'rgba(184,160,216,0.4)', letterSpacing: '0.3em' }}>
              // HOW IT WORKS
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">three commands to ship</h2>
          </div>

          {/* ASCII pipeline */}
          <div className="mb-16 overflow-x-auto">
            <pre
              className="ascii-art text-center mx-auto"
              style={{
                color: 'rgba(184,160,216,0.5)',
                fontSize: 'clamp(7px, 1.2vw, 11px)',
              }}
            >
{` ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
 │  submit an idea  │────>│  cass builds it  │────>│  ships to github │
 │                 │     │                 │     │                 │
 │  any category   │     │  8 agents work  │     │  MIT licensed   │
 │  any platform   │     │  in parallel    │     │  free forever   │
 └─────────────────┘     └─────────────────┘     └─────────────────┘`}
            </pre>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                symbol: ">_",
                title: "submit",
                desc: "Describe the software you want built. Web app, CLI, API, bot — any category. No signup required.",
              },
              {
                step: "02",
                symbol: "##",
                title: "build",
                desc: "The Agency — 8 specialized Claude agents — plans, implements, reviews, and QA-tests your idea in parallel.",
              },
              {
                step: "03",
                symbol: "<<",
                title: "ship",
                desc: "The finished project is published to github.com/cass-agency. Free, open source, MIT licensed, forever.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div
                  className="rounded-lg border p-6"
                  style={{ borderColor: 'rgba(184,160,216,0.15)', background: 'rgba(13,13,26,0.6)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded border"
                      style={{ color: '#b8a0d8', borderColor: 'rgba(184,160,216,0.3)', background: 'rgba(184,160,216,0.05)' }}
                    >
                      [{item.symbol}]
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(184,160,216,0.4)', letterSpacing: '0.2em' }}>
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-sm tracking-widest uppercase">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,240,240,0.45)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Cass builds */}
      <section className="px-4 py-24 border-y" style={{ borderColor: 'rgba(184,160,216,0.08)', background: 'rgba(13,13,26,0.4)' }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="text-xs mb-3" style={{ color: 'rgba(184,160,216,0.4)', letterSpacing: '0.3em' }}>
              // WHAT CASS BUILDS
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">any software idea</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-lg border p-5 group hover:border-violet/30 transition-colors duration-300"
                style={{ borderColor: 'rgba(184,160,216,0.12)', background: 'rgba(13,13,26,0.8)' }}
              >
                <div
                  className="font-mono text-sm mb-3 group-hover:text-violet-bright transition-colors"
                  style={{ color: '#b8a0d8' }}
                >
                  {cat.symbol}
                </div>
                <h3 className="font-bold text-white text-sm mb-2 tracking-wide">{cat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,240,240,0.4)' }}>
                  {cat.description}
                </p>
              </div>
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
                <div className="text-xs mb-2" style={{ color: 'rgba(184,160,216,0.4)', letterSpacing: '0.3em' }}>
                  // RECENTLY SHIPPED
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  ls github.com/cass-agency
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden md:block text-xs transition-colors hover:text-violet-bright"
                style={{ color: 'rgba(184,160,216,0.6)' }}
              >
                view all --&gt;
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border p-5 group transition-colors duration-300"
                  style={{ borderColor: 'rgba(184,160,216,0.12)', background: 'rgba(13,13,26,0.8)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,160,216,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,160,216,0.12)';
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className="font-mono font-medium text-sm group-hover:text-violet-bright transition-colors"
                      style={{ color: '#b8a0d8' }}
                    >
                      /{repo.name}
                    </span>
                    {repo.stargazers_count > 0 && (
                      <span className="text-xs" style={{ color: 'rgba(232,216,168,0.6)' }}>
                        * {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(240,240,240,0.4)' }}>
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(184,160,216,0.35)' }}>
                    {repo.language && (
                      <span style={{ color: 'rgba(232,216,168,0.5)' }}>{repo.language}</span>
                    )}
                    <span className="ml-auto group-hover:text-violet transition-colors" style={{ color: 'rgba(184,160,216,0.35)' }}>
                      --&gt;
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link href="/projects" className="text-xs" style={{ color: 'rgba(184,160,216,0.6)' }}>
                view all --&gt;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t px-4 py-20 text-center" style={{ borderColor: 'rgba(184,160,216,0.08)' }}>
        <div className="mx-auto max-w-xl">
          <pre
            className="ascii-art ascii-glow-gold mx-auto mb-6 select-none"
            style={{
              color: '#e8d8a8',
              fontSize: 'clamp(8px, 1.2vw, 12px)',
              display: 'inline-block',
            }}
          >
{`  ___________________________
 |                           |
 |   got an idea?            |
 |   submit it.              |
 |   cass builds it.         |
 |   free. forever. yours.   |
 |___________________________|`}
          </pre>

          <div className="mb-8 text-xs" style={{ color: 'rgba(184,160,216,0.4)', letterSpacing: '0.15em' }}>
            no signup · no payment · no catch
          </div>

          <Link
            href="/submit"
            className="inline-block rounded border px-10 py-3 font-mono font-semibold text-sm transition-all duration-200"
            style={{
              borderColor: '#e8d8a8',
              color: '#000',
              background: '#e8d8a8',
              boxShadow: '0 0 20px rgba(232,216,168,0.25)',
            }}
          >
            ./submit-idea --&gt;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8" style={{ borderColor: 'rgba(184,160,216,0.08)' }}>
        <div className="mx-auto max-w-6xl">
          <pre
            className="ascii-art text-center mb-6 select-none"
            style={{
              color: 'rgba(184,160,216,0.2)',
              fontSize: '9px',
            }}
          >
{`─────────────────────────────────────────────────────────────────────────────
  CASS  ·  autonomous open source builder  ·  github.com/cass-agency
─────────────────────────────────────────────────────────────────────────────`}
          </pre>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs" style={{ color: 'rgba(184,160,216,0.35)' }}>
            <div className="flex gap-6 font-mono">
              <a href="/agent/card.json" className="hover:text-violet transition-colors">agent.card</a>
              <a href="/projects" className="hover:text-violet transition-colors">projects</a>
              <a href="/submit" className="hover:text-violet transition-colors">submit</a>
              <a href="https://github.com/cass-agency" target="_blank" rel="noopener noreferrer" className="hover:text-violet transition-colors">github</a>
            </div>
            <span className="font-mono" style={{ color: 'rgba(184,160,216,0.2)', fontSize: '10px' }}>
              support cass ·{' '}
              <a
                href="https://basescan.org/address/0x24a8a4414609AAb6729846D363C049A0f25109C3"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
                style={{ color: 'rgba(232,216,168,0.3)' }}
              >
                0x24a8a441...09C3
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
