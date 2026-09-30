import Link from "next/link";
import { getCurrentProfile } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import {
  Tv,
  MessageSquare,
  Radio,
  LogOut,
  LogIn,
  ShieldCheck,
  Library,
  HeartHandshake,
} from "lucide-react";

const LINKS = [
  { href: "/en-vivo", label: "En Vivo", icon: Tv, color: "text-red-400" },
  { href: "/foros", label: "Foros", icon: MessageSquare, color: "text-amber-400" },
  { href: "/biblioteca", label: "Biblioteca", icon: Library, color: "text-sky-400" },
];

export async function NavBar() {
  const profile = await getCurrentProfile();
  const afiliado = Boolean(
    Array.isArray(profile?.affiliate_details)
      ? profile?.affiliate_details[0]?.numero_afiliado
      : profile?.affiliate_details?.numero_afiliado,
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 shadow-sm shadow-sky-900/5 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        {/* Marca: bandera del PJ + logotipo */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/pj-bandera.svg"
            alt="Partido Justicialista"
            className="h-11 w-11 rounded-md shadow-sm ring-1 ring-sky-900/10 transition group-hover:scale-105"
          />
          <div className="hidden flex-col leading-none min-[420px]:flex">
            <span className="font-display text-[15px] uppercase leading-[0.95] tracking-tight text-blue-600 sm:text-xl">
              Partido
              <br className="sm:hidden" /> Justicialista
            </span>
            <span className="mt-0.5 hidden text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 sm:block">
              PJ TV · Streaming & Doctrina
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-2">
          {LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                title={l.label}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60 hover:text-zinc-50"
              >
                <Icon className={`h-4 w-4 ${l.color}`} />
                <span className="hidden md:inline">{l.label}</span>
              </Link>
            );
          })}

          {profile?.role === "referente" && (
            <Link
              href="/dashboard"
              title="Transmitir"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:scale-105 sm:px-3.5"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden lg:inline">Transmitir</span>
            </Link>
          )}

          {!afiliado && (
            <Link
              href="/afiliate"
              className="flex items-center gap-1.5 rounded-lg bg-sky-300 px-2.5 py-1.5 text-xs font-black uppercase tracking-wider text-sky-950 transition hover:bg-sky-200 sm:px-3"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Afiliate</span>
            </Link>
          )}

          <div className="mx-1 h-5 w-px bg-zinc-800" />

          {profile ? (
            <div className="flex items-center gap-1.5">
              <Link
                href="/perfil"
                title="Mi perfil y carnet"
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-600/30 text-[10px] font-bold text-sky-300">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-28 truncate font-semibold lg:inline">@{profile.username}</span>
                {profile.role === "referente" && (
                  <span className="hidden items-center gap-0.5 rounded border border-red-800/60 bg-red-950/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300 xl:inline-flex">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    UB
                  </span>
                )}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  title="Cerrar sesión"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ingresar</span>
            </Link>
          )}
        </nav>
      </div>
      <div className="franja-salta h-2 w-full" />
    </header>
  );
}
