"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { afiliarse } from "@/app/actions/profile";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  UserRound,
  PartyPopper,
} from "lucide-react";

const PROVINCIAS = [
  "Salta", "Buenos Aires", "Ciudad de Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones",
  "Neuquén", "Río Negro", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán",
];

const INTERESES = [
  "Formación política", "Juventud", "Mujeres y diversidad", "Trabajo y producción",
  "Cultura", "Acción social", "Comunicación", "Deportes",
];

const PASOS = [
  { n: 1, label: "Tus datos", icon: UserRound },
  { n: 2, label: "Territorio", icon: MapPin },
  { n: 3, label: "Adhesión", icon: HeartHandshake },
];

const inputClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 focus:border-sky-500 focus:outline-none";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-zinc-300";

export default function AfiliatePage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [numero, setNumero] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    provincia: "Salta",
    localidad: "",
    barrio: "",
    intereses: [] as string[],
    adhesion: false,
  });

  const set = (k: keyof typeof form, v: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const puedeAvanzar =
    paso === 1
      ? form.nombre_completo.trim().length >= 3 && form.email.includes("@")
      : paso === 2
        ? form.localidad.trim().length >= 2
        : form.adhesion;

  function enviar() {
    setError(null);
    startTransition(async () => {
      const res = await afiliarse(form);
      if (res.error) setError(res.error);
      else {
        setNumero(res.numero ?? null);
        router.refresh();
      }
    });
  }

  if (numero) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <PartyPopper className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-zinc-50">¡Bienvenido/a al Movimiento!</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Tu afiliación digital quedó registrada con el número
          </p>
          <p className="mt-2 inline-block rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2 font-mono text-xl font-black text-amber-200">
            {numero}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/perfil"
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500"
          >
            Ver mi carnet digital
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/en-vivo"
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800"
          >
            Ir a las transmisiones
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Afiliación digital</span>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">
          Sumate al Partido Justicialista
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          En tres pasos y desde tu celular. Al terminar recibís tu carnet digital de afiliado/a.
        </p>
      </div>

      {/* Indicador de pasos */}
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {PASOS.map((p, i) => {
          const Icon = p.icon;
          const done = paso > p.n;
          const active = paso === p.n;
          return (
            <li key={p.n} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition ${
                    done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : active
                        ? "border-sky-400 bg-sky-500/20 text-sky-300"
                        : "border-zinc-700 text-zinc-500"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className={`hidden text-xs font-semibold sm:inline ${active ? "text-zinc-50" : "text-zinc-500"}`}>
                  {p.label}
                </span>
              </div>
              {i < PASOS.length - 1 && <span className="h-px w-6 bg-zinc-700 sm:w-10" />}
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-md sm:p-8">
        {paso === 1 && (
          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Nombre y apellido</label>
              <input value={form.nombre_completo} onChange={(e) => set("nombre_completo", e.target.value)} placeholder="Ej: María Eva Duarte" className={inputClass} autoFocus />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={labelClass}>Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@correo.com" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Celular (opcional)</label>
                <input type="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="387 4xx xxxx" className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Fecha de nacimiento (opcional)</label>
              <input type="date" value={form.fecha_nacimiento} onChange={(e) => set("fecha_nacimiento", e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={labelClass}>Provincia</label>
                <select value={form.provincia} onChange={(e) => set("provincia", e.target.value)} className={inputClass}>
                  {PROVINCIAS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Localidad / Municipio</label>
                <input value={form.localidad} onChange={(e) => set("localidad", e.target.value)} placeholder="Ej: Salta Capital, Lanús" className={inputClass} autoFocus />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Barrio (opcional)</label>
              <input value={form.barrio} onChange={(e) => set("barrio", e.target.value)} placeholder="Ej: Villa Las Rosas, Remedios de Escalada" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>¿En qué te gustaría participar?</label>
              <div className="flex flex-wrap gap-2">
                {INTERESES.map((i) => {
                  const on = form.intereses.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        set("intereses", on ? form.intereses.filter((x) => x !== i) : [...form.intereses, i])
                      }
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        on
                          ? "bg-sky-500 text-zinc-950"
                          : "border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {paso === 3 && (
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 text-sm leading-relaxed text-zinc-300">
              <p className="mb-3 font-bold text-zinc-50">Declaración de adhesión</p>
              <p>
                Adhiero a la doctrina del Justicialismo y a sus tres banderas históricas:{" "}
                <strong className="text-sky-300">Justicia Social</strong>,{" "}
                <strong className="text-sky-300">Independencia Económica</strong> y{" "}
                <strong className="text-sky-300">Soberanía Política</strong>. Me comprometo a participar
                en la vida del Movimiento con solidaridad, respeto y vocación de servicio a la comunidad.
              </p>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-200">
              <input
                type="checkbox"
                checked={form.adhesion}
                onChange={(e) => set("adhesion", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-sky-500"
              />
              <span>Acepto la declaración de adhesión y quiero afiliarme digitalmente.</span>
            </label>
            <p className="text-[11px] text-zinc-500">
              Afiliación digital de demostración. No se solicita DNI. La afiliación formal ante la
              Justicia Electoral se completa luego en tu Unidad Básica.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-800/60 bg-red-950/60 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-zinc-800/60 pt-5">
          <button
            type="button"
            onClick={() => setPaso((p) => p - 1)}
            disabled={paso === 1}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-zinc-50 disabled:invisible"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </button>
          {paso < 3 ? (
            <button
              type="button"
              onClick={() => setPaso((p) => p + 1)}
              disabled={!puedeAvanzar}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-40"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={enviar}
              disabled={!puedeAvanzar || pending}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-sky-600/30 transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              {pending ? "Registrando..." : "Afiliarme"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
