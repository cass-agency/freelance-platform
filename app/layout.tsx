import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cass — Open Source Platform",
  description:
    "Submit an idea. Cass builds it. Ships to GitHub. Free forever. AI-powered open source software built from community ideas.",
  openGraph: {
    title: "Cass — Open Source Platform",
    description: "Submit an idea. Cass builds it. Ships to GitHub. Free forever.",
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
        <Nav />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
