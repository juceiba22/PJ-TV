"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { createLiveStream } from "@/app/actions/streams";
import { createClient } from "@/lib/supabase/client";

const CATEGORIAS = [
  { slug: "filosofia-justicialista", label: "Filosofía Justicialista" },
  { slug: "principios-doctrinarios", label: "Principios Doctrinarios" },
  { slug: "principios-politicos", label: "Principios Políticos" },
  { slug: "lineamientos-economicos", label: "Lineamientos Económicos" },
  { slug: "cultura", label: "Cultura" },
  { slug: "independencia-economica", label: "Independencia Económica" },
  { slug: "justicia-social", label: "Justicia Social" },
  { slug: "soberania-politica", label: "Soberanía Política" },
];

export function GoLiveForm() {
  const [state, action, pending] = useActionState(createLiveStream, undefined);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<string>("idle");

  const result = state && "rtmpUrl" in state ? state : null;
  const error = state && "error" in state ? state.error : null;

  const supabase = createClient();

  useEffect(() => {
    if (!result?.streamId) return;

    setLiveStatus("idle");

    const channel = supabase
      .channel(`studio-stream:${result.streamId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "streams",
          filter: `id=eq.${result.streamId}`,
        },
        (payload) => {
          const row = payload.new as { status?: string };
          if (row.status) {
            setLiveStatus(row.status);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [result?.streamId, supabase]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  if (result) {
    return (
      <div className="rounded-xl border border-blue-400 bg-blue-50/80 p-6 shadow-sm dark:border-blue-800 dark:bg-blue-950/40">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span className="text-xl">✅</span>
            <h2 className="text-lg font-bold">"{result.title}" está lista para emitir</h2>
          </div>

          {liveStatus === "active" ? (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white" />
              ¡Conectado y En Vivo!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-ping" />
              Esperando conexión OBS...
            </span>
          )}
        </div>

        {liveStatus === "active" && (
          <div className="mt-3 rounded-lg bg-green-100 p-3 text-sm text-green-900 dark:bg-green-950/50 dark:text-green-200 flex items-center justify-between gap-2">
            <span>🎉 <strong>Señal RTMP recibida:</strong> Tu transmisión ya está al aire.</span>
            <Link
              href={`/stream/${result.streamId}`}
              className="rounded bg-green-700 px-3 py-1 text-xs font-bold text-white hover:bg-green-800 transition"
            >
              Ver Sala Pública ↗
            </Link>
          </div>
        )}
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
          Abrí tu software de transmisión (como <strong>OBS Studio</strong> o <strong>Streamlabs</strong>), andá a <em>Ajustes &gt; Emisión</em> y configurá:
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Servidor / URL RTMP
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                readOnly
                value={result.rtmpUrl}
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(result.rtmpUrl, "rtmp")}
                className="shrink-0 rounded bg-neutral-200 px-3 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                {copiedField === "rtmp" ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Clave de emisión (Stream Key)
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                readOnly
                type="password"
                value={result.streamKey}
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(result.streamKey, "key")}
                className="shrink-0 rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                {copiedField === "key" ? "¡Copiado!" : "Copiar Clave"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-blue-100/70 p-3 text-xs leading-relaxed text-blue-900 dark:bg-blue-900/30 dark:text-blue-200">
          ℹ️ <strong>Importante:</strong> Guardá esta clave ahora. En cuanto inicies transmisión en OBS, Mux detectará la señal por webhook y tu stream cambiará a estado <strong>🔴 EN VIVO</strong> automáticamente en la portada.
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div>
        <h2 className="text-lg font-bold">Iniciar nueva transmisión</h2>
        <p className="text-sm text-neutral-500">
          Completá los datos básicos para obtener tus credenciales de emisión RTMP.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-neutral-600 dark:text-neutral-400">
          Título de la transmisión
        </label>
        <input
          name="title"
          placeholder="Ej: Debate Territorial UB San Martín - La Matanza"
          required
          minLength={3}
          maxLength={140}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-neutral-600 dark:text-neutral-400">
          Categoría doctrinaria
        </label>
        <select
          name="categoria"
          defaultValue=""
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="">Sin categoría específica</option>
          {CATEGORIAS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 self-start rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Generando credenciales...</span>
          </>
        ) : (
          <>
            <span>🔴</span>
            <span>Generar datos de emisión</span>
          </>
        )}
      </button>
    </form>
  );
}
