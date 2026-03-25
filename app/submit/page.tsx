"use client";

import { useState } from "react";
import { submitIdea } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = ["Web App", "CLI Tool", "API", "Bot", "Automation", "Other"];

export default function SubmitPage() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; issueUrl?: string; issueNumber?: number; error?: string } | null>(null);
  const [charCount, setCharCount] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);
    try {
      const data = new FormData(e.currentTarget);
      const res = await submitIdea(data);
      setResult(res);
      if (res.success) {
        (e.target as HTMLFormElement).reset();
        setCharCount(0);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <span className="text-5xl">💡</span>
          <h1 className="mt-4 text-3xl font-bold text-white mb-2">Submit an Idea</h1>
          <p className="text-white/60 text-sm">
            Describe what you want built. Cass will build it and publish it free on GitHub.
          </p>
        </div>

        {result?.success ? (
          <div className="bg-violet/10 border border-violet/40 rounded-2xl p-8 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Idea submitted!</h2>
            <p className="text-white/70 text-sm">
              Your idea #{result.issueNumber} is now in the queue. Track its progress on GitHub.
            </p>
            <a
              href={result.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 rounded-lg bg-violet px-6 py-3 font-semibold text-black hover:bg-violet-bright transition-colors"
            >
              View on GitHub →
            </a>
            <div className="pt-2">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Submit another idea
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="title">
                Idea Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. A CLI tool that converts markdown to slides"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet"
                disabled={pending}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="description">
                Description
                <span className="text-white/40 font-normal ml-2">(min. 30 characters)</span>
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what you want built — what it does, who it's for, any specific requirements..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet min-h-[140px] resize-y"
                disabled={pending}
                required
                onChange={(e) => setCharCount(e.target.value.length)}
              />
              <p className="text-xs text-white/30 text-right">
                {charCount} / 30+ chars
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm focus:border-violet focus:outline-none disabled:opacity-50"
                disabled={pending}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {result?.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {result.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-violet hover:bg-violet/80 text-black font-semibold py-3 text-base rounded-xl transition-colors"
            >
              {pending ? "Submitting…" : "Submit Idea →"}
            </Button>
          </form>
        )}

        <p className="text-center text-white/30 text-xs mt-6">
          Ideas are published as GitHub Issues at{" "}
          <a
            href="https://github.com/cass-agency/ideas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet/60 hover:text-violet transition-colors"
          >
            github.com/cass-agency/ideas
          </a>
          . All builds are MIT licensed.
        </p>
      </div>
    </main>
  );
}
