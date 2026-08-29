import Link from "next/link";
import { getCurrentProfile } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import {
  Tv,
  MessageSquare,
  Radio,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

export async function NavBar() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-amber-400 p-0.5 shadow-md shadow-blue-500/20 transition group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <span className="bg-gradient-to-br from-sky-400 to-amber-300 bg-clip-text text-sm font-black tracking-tighter text-transparent">
                PJ
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-wider text-white">
              PJ <span className="text-sky-400">TV</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              Streaming & Doctrina
            </span>
          </div>
        </Link>

        {/* Center & Right Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60 hover:text-white"
          >
            <Tv className="h-4 w-4 text-sky-400" />
            <span>En Vivo</span>
          </Link>

          <Link
            href="/foros"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60 hover:text-white"
          >
            <MessageSquare className="h-4 w-4 text-amber-400" />
            <span>Foros</span>
          </Link>

          {/* Botón Transmitir para Referentes */}
          {profile?.role === "referente" && (
            <Link
              href="/dashboard"
              className="relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:scale-105 hover:shadow-red-600/50"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Transmitir</span>
            </Link>
          )}

          <div className="h-5 w-px bg-zinc-800" />

          {profile ? (
            <div className="flex items-center gap-2">
              {/* Carnet / Perfil */}
              <Link
                href="/perfil"
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/30 text-[10px] font-bold text-sky-400">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold">@{profile.username}</span>
                {profile.role === "referente" && (
                  <span className="hidden md:inline-flex items-center gap-0.5 rounded bg-red-950/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300 border border-red-800/60">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    UB
                  </span>
                )}
              </Link>

              {/* Botón Salir */}
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
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Ingresar</span>
              </Link>
              <Link
                href="/registro"
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Registrarme</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
