"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  MapPin,
  Building2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function RegistroPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState<"afiliado" | "referente">("afiliado");

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/30">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-zinc-50">Crear cuenta en PJ TV</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Sumate a la plataforma de streaming y debate doctrinario
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          {/* Selector de Rol */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Tipo de Militancia / Rol
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("afiliado")}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                  role === "afiliado"
                    ? "border-sky-500 bg-sky-500/15 text-sky-400 shadow-md shadow-sky-500/20"
                    : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Afiliado / Militante</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("referente")}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                  role === "referente"
                    ? "border-red-500 bg-red-500/15 text-red-400 shadow-md shadow-red-500/20"
                    : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Referente (UB)</span>
              </button>
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              <User className="h-3.5 w-3.5 text-sky-400" />
              <span>Nombre de Usuario</span>
            </label>
            <input
              id="username"
              name="username"
              placeholder="juan_militante"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
            />
            {state?.errors?.username && (
              <p className="text-xs text-red-400">{state.errors.username[0]}</p>
            )}
          </div>

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
              placeholder="compañero@pj.org.ar"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
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
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
            />
            {state?.errors?.password && (
              <p className="text-xs text-red-400">{state.errors.password[0]}</p>
            )}
          </div>

          {/* Datos Territoriales para Referentes */}
          {role === "referente" && (
            <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-red-500/40 bg-red-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-300 border-b border-red-800/40 pb-2">
                <Building2 className="h-4 w-4" />
                <span>Datos Territoriales de la Unidad Básica</span>
              </div>

              <div className="space-y-1">
                <label htmlFor="provincia" className="text-xs text-zinc-300">
                  Provincia
                </label>
                <input
                  id="provincia"
                  name="provincia"
                  placeholder="Ej: Buenos Aires"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-50 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="ciudad_municipio" className="text-xs text-zinc-300">
                  Ciudad / Municipio
                </label>
                <input
                  id="ciudad_municipio"
                  name="ciudad_municipio"
                  placeholder="Ej: La Matanza"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-50 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="barrio_direccion" className="text-xs text-zinc-300">
                  Barrio / Dirección
                </label>
                <input
                  id="barrio_direccion"
                  name="barrio_direccion"
                  placeholder="Ej: San Justo - Av. Illia 2400"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-50 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="nombre_unidad_basica" className="text-xs text-zinc-300">
                  Nombre de la Unidad Básica (opcional)
                </label>
                <input
                  id="nombre_unidad_basica"
                  name="nombre_unidad_basica"
                  placeholder="Ej: UB Evita Capitana"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-50 focus:border-red-500 focus:outline-none"
                />
              </div>

              {state?.errors?.provincia && (
                <p className="text-xs text-red-400">{state.errors.provincia[0]}</p>
              )}
            </div>
          )}

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
                <span>Registrando militante...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-zinc-800/60 pt-4 text-center text-xs text-zinc-400">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="font-bold text-sky-400 underline hover:text-sky-300"
          >
            Ingresá acá
          </Link>
        </div>
      </div>
    </main>
  );
}
