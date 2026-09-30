import type { Metadata } from "next";
import Link from "next/link";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PJ TV — Streaming, doctrina y afiliación digital",
  description:
    "La plataforma digital del Justicialismo: transmisiones en vivo desde cada Unidad Básica, foros doctrinarios, biblioteca y afiliación digital.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100 selection:bg-sky-500 selection:text-white">
        <NavBar />
        {children}
        <footer className="border-t border-zinc-800/60 bg-zinc-950 print:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="font-display text-base uppercase tracking-wider text-zinc-300">
                PJ <span className="text-[#74acdf]">TV</span>
              </p>
              <p>Justicia Social · Independencia Económica · Soberanía Política</p>
            </div>
            <nav className="flex flex-wrap gap-4">
              <Link href="/en-vivo" className="hover:text-zinc-200">En vivo</Link>
              <Link href="/foros" className="hover:text-zinc-200">Foros</Link>
              <Link href="/biblioteca" className="hover:text-zinc-200">Biblioteca</Link>
              <Link href="/afiliate" className="hover:text-zinc-200">Afiliate</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
