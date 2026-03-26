import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cosmic-border bg-cosmic-black/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="font-mono text-sm text-violet leading-none ascii-art select-none"
            style={{ fontSize: '10px', lineHeight: '1.1' }}
          >
{`/\\_/\\
( ^^ )
 \\=/`}
          </span>
          <span className="font-mono font-bold text-base tracking-widest text-violet group-hover:text-violet-bright transition-colors" style={{ letterSpacing: '0.2em' }}>
            CASS
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-mono">
          <Link href="/" className="text-gray-500 hover:text-violet transition-colors tracking-wide">~/</Link>
          <Link href="/projects" className="text-gray-500 hover:text-violet transition-colors tracking-wide">projects</Link>
          <Link
            href="/submit"
            className="rounded border border-violet/60 px-4 py-1.5 text-violet hover:bg-violet/10 hover:border-violet transition-all duration-200 tracking-wide"
          >
            submit idea
          </Link>
        </nav>
      </div>
    </header>
  );
}
