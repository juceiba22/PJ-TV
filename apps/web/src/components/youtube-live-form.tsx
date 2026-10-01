"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createYouTubeStream } from "@/app/actions/streams";
import { CATEGORIAS } from "@/lib/categorias";
import { AlertCircle, CheckCircle2, ExternalLink, PlayCircle } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 focus:border-sky-500 focus:outline-none";

const PASOS = [
  "Iniciá el vivo en el canal de YouTube de tu Unidad Básica (desde OBS o desde la app de YouTube).",
  "Copiá el enlace del vivo: botón Compartir en YouTube.",
  "Pegalo acá abajo y publicá. Aparece en PJ TV con el chat de la militancia.",
];

export function YouTubeLiveForm() {
  const [state, action, pending] = useActionState(createYouTubeStream, undefined);
  const result = state && "streamId" in state ? state : null;
  const error = state && "error" in state ? state.error : null;

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-600/30">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-50">Transmitir por YouTube</h2>
            <p className="text-xs text-zinc-400">Recomendado · sin costo de transmisión</p>
          </div>
        </div>
      </div>

      {result ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            ¡“{result.title}” ya está en vivo en PJ TV!
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/stream/${result.streamId}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              Ver la sala en vivo <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <span className="self-center text-xs text-zinc-400">
              Al terminar, finalizala desde el historial de abajo.
            </span>
          </div>
        </div>
      ) : (
        <>
          <ol className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-xs leading-relaxed text-zinc-300">
                <span className="font-display text-2xl leading-none text-sky-300">{i + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>

          <form action={action} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <input name="title" required placeholder="Título de la transmisión" className={`${inputClass} sm:col-span-2`} />
              <select name="categoria" defaultValue="" className={inputClass}>
                <option value="">Sin categoría</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              name="youtube_url"
              required
              type="url"
              placeholder="https://www.youtube.com/live/..."
              className={inputClass}
            />
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="flex items-center justify-center gap-2 self-start rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 disabled:opacity-50"
            >
              {pending ? "Publicando..." : "Publicar en vivo"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
