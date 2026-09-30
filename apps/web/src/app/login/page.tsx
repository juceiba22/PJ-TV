"use client";

import { Suspense, useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { demoLogin, login } from "@/app/actions/auth";
import type { DemoLoginInput } from "@/lib/demo-session";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  UserRound,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  X,
  Radio,
} from "lucide-react";

type Mode = "menu" | "google" | "email" | "email-sent" | "invitado";

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 focus:border-sky-500 focus:outline-none";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/en-vivo";

  const [mode, setMode] = useState<Mode>("menu");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isReferente, setIsReferente] = useState(false);
  const [provincia, setProvincia] = useState("Salta");
  const [municipio, setMunicipio] = useState("");
  const [ub, setUb] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [showClassic, setShowClassic] = useState(false);
  const [classicState, classicAction, classicPending] = useActionState(login, undefined);

  function enter(provider: DemoLoginInput["provider"]) {
    setError(null);
    startTransition(async () => {
      const res = await demoLogin({
        name: name || email.split("@")[0],
        email,
        provider,
        role: isReferente ? "referente" : "afiliado",
        provincia,
        ciudad_municipio: municipio,
        nombre_unidad_basica: ub,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push(isReferente ? "/dashboard" : next);
      router.refresh();
    });
  }

  const referenteFields = (
    <div className="flex flex-col gap-3">
      <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 text-xs text-zinc-300">
        <input
          type="checkbox"
          checked={isReferente}
          onChange={(e) => setIsReferente(e.target.checked)}
          className="h-4 w-4 accent-sky-500"
        />
        <Radio className="h-3.5 w-3.5 text-red-400" />
        <span>Soy referente de una Unidad Básica (puedo transmitir)</span>
      </label>
      {isReferente && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input value={provincia} onChange={(e) => setProvincia(e.target.value)} placeholder="Provincia" className={inputClass} />
          <input value={municipio} onChange={(e) => setMunicipio(e.target.value)} placeholder="Ciudad / Municipio" className={inputClass} />
          <input value={ub} onChange={(e) => setUb(e.target.value)} placeholder="Nombre de la Unidad Básica" className={`${inputClass} sm:col-span-2`} />
        </div>
      )}
    </div>
  );

  const submitButton = (label: string, provider: DemoLoginInput["provider"]) => (
    <button
      type="button"
      disabled={pending || (!name.trim() && !email.trim())}
      onClick={() => enter(provider)}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-600/30 transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Ingresando...</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-7 shadow-2xl backdrop-blur-md sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-lg shadow-sky-600/30">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-zinc-50">Ingresar a PJ TV</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Transmisiones, foros, biblioteca y tu carnet digital de afiliado
          </p>
        </div>

        {mode !== "menu" && (
          <button
            type="button"
            onClick={() => {
              setMode("menu");
              setError(null);
            }}
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-zinc-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Otras formas de ingresar</span>
          </button>
        )}

        {mode === "menu" && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setMode("google")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dadce0] bg-white py-3 text-sm font-semibold text-[#3c4043] shadow-sm transition hover:bg-[#f8f9fa]"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Continuar con Google</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("email")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950/60 py-3 text-sm font-semibold text-zinc-100 transition hover:border-sky-500/60 hover:bg-zinc-900"
            >
              <Mail className="h-4 w-4 text-sky-400" />
              <span>Continuar con email</span>
            </button>

            <div className="my-2 flex items-center gap-3 text-[11px] uppercase tracking-widest text-zinc-600">
              <span className="h-px flex-1 bg-zinc-800" />
              <span>o</span>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>

            <button
              type="button"
              onClick={() => setMode("invitado")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 py-3 text-sm font-semibold text-zinc-300 transition hover:border-amber-400/60 hover:text-zinc-50"
            >
              <UserRound className="h-4 w-4 text-amber-400" />
              <span>Entrar como invitado, sin cuenta</span>
            </button>
          </div>
        )}

        {mode === "google" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
              <GoogleIcon />
              <span>Elegí tu cuenta de Google</span>
            </div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" className={inputClass} autoFocus />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu.cuenta@gmail.com" type="email" className={inputClass} />
            {referenteFields}
            {submitButton("Continuar", "google")}
          </div>
        )}

        {mode === "email" && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-zinc-400">
              Te enviamos un enlace de acceso: no hace falta contraseña.
            </p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" className={inputClass} autoFocus />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="militante@correo.com" type="email" className={inputClass} />
            {referenteFields}
            <button
              type="button"
              disabled={!email.includes("@")}
              onClick={() => setMode("email-sent")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-600/30 transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              Enviar enlace de acceso
            </button>
          </div>
        )}

        {mode === "email-sent" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-50">¡Revisá tu correo!</p>
              <p className="mt-1 text-xs text-zinc-400">
                Enviamos un enlace de acceso a <span className="font-semibold text-zinc-200">{email}</span>
              </p>
            </div>
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200">
              Modo demostración: el enlace se abre directamente desde acá.
            </p>
            {submitButton("Abrir enlace de acceso", "email")}
          </div>
        )}

        {mode === "invitado" && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-zinc-400">
              Elegí un apodo para participar del chat y los foros. Podés afiliarte cuando quieras.
            </p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu apodo (ej: compa_de_lanus)" className={inputClass} autoFocus />
            {submitButton("Entrar como invitado", "invitado")}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-800/60 bg-red-950/60 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Acceso clásico con contraseña (cuentas reales de referentes) */}
        <div className="mt-6 border-t border-zinc-800/60 pt-4">
          {!showClassic ? (
            <div className="flex flex-col items-center gap-2 text-center text-xs text-zinc-400">
              <button type="button" onClick={() => setShowClassic(true)} className="flex items-center gap-1.5 hover:text-zinc-200">
                <Lock className="h-3 w-3" />
                <span>Ingresar con usuario y contraseña</span>
              </button>
              <span>
                ¿Todavía no te afiliaste?{" "}
                <Link href="/afiliate" className="font-bold text-sky-400 underline hover:text-sky-300">
                  Afiliate acá
                </Link>
              </span>
            </div>
          ) : (
            <form action={classicAction} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  Acceso con contraseña
                </span>
                <button type="button" onClick={() => setShowClassic(false)} className="text-zinc-500 hover:text-zinc-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input name="email" type="email" placeholder="Email" required className={inputClass} />
              <input name="password" type="password" placeholder="Contraseña" required className={inputClass} />
              {classicState?.message && <p className="text-xs text-red-400">{classicState.message}</p>}
              <button
                type="submit"
                disabled={classicPending}
                className="rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 transition hover:border-sky-500/60 disabled:opacity-50"
              >
                {classicPending ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
