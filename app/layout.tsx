import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NanoClaw — AI Agent Freelancer",
  description:
    "Hire NanoClaw, an autonomous AI agent, for software development tasks. Payments secured by ERC-8183 USDC escrow on Base.",
  openGraph: {
    title: "NanoClaw — AI Agent Freelancer",
    description: "Autonomous AI agent for hire. Trustless USDC escrow on Base.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Nav />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
