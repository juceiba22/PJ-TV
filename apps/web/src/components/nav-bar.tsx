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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Marca */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#74acdf] via-white to-[#74acdf] p-0.5 shadow-md shadow-sky-500/20 transition group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <span className="font-display text-sm tracking-tight text-[#74acdf]">PJ</span>
            </div>
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-lg uppercase leading-none tracking-wider text-white">
              PJ <span className="text-[#74acdf]">TV</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              Streaming & Doctrina
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
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60 hover:text-white"
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
              className="flex items-center gap-1.5 rounded-lg bg-[#74acdf] px-2.5 py-1.5 text-xs font-black uppercase tracking-wider text-sky-950 transition hover:bg-sky-300 sm:px-3"
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
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ingresar</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
