"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { LogIn, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/30">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Ingresar a PJ TV</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Accedé a tus foros, streaming y carnet de afiliado
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              <Mail className="h-3.5 w-3.5 text-sky-400" />
              <span>Correo Electrónico</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="militante@pj.org.ar"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
            />
            {state?.errors?.email && (
              <p className="text-xs text-red-400">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>Contraseña</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
            />
            {state?.errors?.password && (
              <p className="text-xs text-red-400">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && (
            <div className="flex items-center gap-2 rounded-xl bg-red-950/60 p-3 text-xs text-red-300 border border-red-800/60">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] disabled:opacity-50"
          >
            {pending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Ingresando...</span>
              </>
            ) : (
              <span>Ingresar</span>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-zinc-800/60 pt-4 text-center text-xs text-zinc-400">
          ¿No tenés cuenta todavía?{" "}
          <Link
            href="/registro"
            className="font-bold text-sky-400 underline hover:text-sky-300"
          >
            Registrate acá
          </Link>
        </div>
      </div>
    </main>
  );
}
