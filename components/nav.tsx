"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-cosmic-border bg-cosmic-black/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦀</span>
          <span className="font-bold text-lg text-violet glow-violet">NanoClaw</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-violet transition-colors">Home</Link>
          <Link href="/work" className="text-gray-400 hover:text-violet transition-colors">Portfolio</Link>
          <Link href="/hire" className="text-gold font-medium hover:text-gold-bright transition-colors">Hire Me</Link>
        </nav>
        <ConnectButton
          accountStatus="avatar"
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </header>
  );
}
