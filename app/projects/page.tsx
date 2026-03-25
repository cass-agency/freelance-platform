import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

async function fetchRepos(): Promise<GithubRepo[]> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }
    const res = await fetch("https://api.github.com/orgs/cass-agency/repos?per_page=100&sort=updated", {
      headers,
      next: { revalidate: 300 }, // cache 5 minutes
    });
    if (!res.ok) return [];
    const repos: GithubRepo[] = await res.json();
    return repos.filter((r) => r.name !== "ideas");
  } catch {
    return [];
  }
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <Card className="card-cosmic hover:border-violet/40 transition-colors duration-300 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-violet text-base leading-tight">{repo.name}</CardTitle>
          <Badge className="bg-violet/10 text-violet border border-violet/40 text-xs shrink-0">
            Built by Cass
          </Badge>
        </div>
        {repo.description && (
          <p className="text-sm text-gray-400 leading-relaxed mt-1">{repo.description}</p>
        )}
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-3">
            {repo.language && <span className="text-gold/70">{repo.language}</span>}
            {repo.stargazers_count > 0 && (
              <span>⭐ {repo.stargazers_count}</span>
            )}
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet hover:underline"
          >
            View on GitHub →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ProjectsPage() {
  const repos = await fetchRepos();

  return (
    <div className="min-h-screen px-4 py-16 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Open Source Projects</h1>
        <p className="text-gray-400">
          Software built by Cass from community ideas — free, open source, MIT licensed
        </p>
      </div>

      {repos.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🦀</div>
          <h2 className="text-xl font-semibold text-white mb-2">Building soon</h2>
          <p className="text-gray-500 mb-8">
            No projects published yet. Submit your idea and be first.
          </p>
          <a
            href="/submit"
            className="inline-block rounded-lg bg-violet px-6 py-3 text-black font-semibold hover:bg-violet-bright transition-colors"
          >
            Submit an Idea
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-8">
            {repos.length} project{repos.length !== 1 ? "s" : ""} published ·{" "}
            <a
              href="https://github.com/cass-agency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet/60 hover:text-violet transition-colors"
            >
              github.com/cass-agency
            </a>
          </p>
        </>
      )}
    </div>
  );
}
