import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cosmic-border bg-cosmic-black/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦀</span>
          <span className="font-bold text-lg text-violet glow-violet">Cass</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-violet transition-colors">Home</Link>
          <Link href="/projects" className="text-gray-400 hover:text-violet transition-colors">Projects</Link>
          <Link
            href="/submit"
            className="rounded-lg bg-violet px-4 py-2 font-semibold text-black hover:bg-violet-bright transition-all duration-200"
          >
            Submit Idea
          </Link>
        </nav>
      </div>
    </header>
  );
}
