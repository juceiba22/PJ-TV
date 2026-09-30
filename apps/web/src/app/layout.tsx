import type { Metadata } from "next";
import Link from "next/link";
import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
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

// Condensada y pesada, como el logotipo "PARTIDO JUSTICIALISTA"
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PJ TV — Partido Justicialista",
  description:
    "La plataforma digital del Justicialismo: transmisiones en vivo desde cada Unidad Básica, foros doctrinarios, biblioteca y afiliación digital.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-100 selection:bg-sky-300 selection:text-sky-950">
        <NavBar />
        {children}
        <footer className="mt-auto print:hidden">
          <div className="franja-salta h-3 w-full" />
          <div className="bg-blue-900 text-sky-100">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/pj-escudo.svg" alt="" className="h-12 w-12" />
                <div>
                  <p className="font-display text-xl uppercase leading-none tracking-wide text-white">
                    Partido Justicialista
                  </p>
                  <p className="mt-1 text-sky-200/80">Justicia Social · Independencia Económica · Soberanía Política</p>
                </div>
              </div>
              <nav className="flex flex-wrap gap-4 font-semibold">
                <Link href="/en-vivo" className="hover:text-white">En vivo</Link>
                <Link href="/foros" className="hover:text-white">Foros</Link>
                <Link href="/biblioteca" className="hover:text-white">Biblioteca</Link>
                <Link href="/afiliate" className="hover:text-white">Afiliate</Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
