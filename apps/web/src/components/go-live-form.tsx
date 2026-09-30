"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { createLiveStream } from "@/app/actions/streams";
import { createClient } from "@/lib/supabase/client";
import {
  Radio,
  Copy,
  Check,
  Server,
  Key,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from "lucide-react";

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
      <div className="rounded-3xl border border-sky-500/40 bg-gradient-to-br from-sky-950/30 via-zinc-900/80 to-zinc-950 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Canal RTMP Asignado
              </span>
              <h2 className="text-lg font-bold text-zinc-50">"{result.title}"</h2>
            </div>
          </div>

          {liveStatus === "active" ? (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/40 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white" />
              ¡Conectado y En Vivo!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/80 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              Esperando conexión OBS...
            </span>
          )}
        </div>

        {liveStatus === "active" && (
          <div className="mt-4 rounded-2xl bg-emerald-950/50 p-4 text-xs text-emerald-200 border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <span>🎉 <strong>¡Señal recibida con éxito!</strong> Tu transmisión ya está disponible en la portada y sala pública.</span>
            <Link
              href={`/stream/${result.streamId}`}
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow"
            >
              <span>Ir a Sala Pública</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <p className="mt-4 text-xs leading-relaxed text-zinc-300">
          Copiá y pegá estos datos en <strong>OBS Studio</strong> (<em>Ajustes &gt; Emisión &gt; Servicio: Personalizado</em>):
        </p>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <Server className="h-3.5 w-3.5 text-sky-400" />
              <span>URL del Servidor (RTMP)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={result.rtmpUrl}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 font-mono text-xs text-zinc-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(result.rtmpUrl, "rtmp")}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-700"
              >
                {copiedField === "rtmp" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <Key className="h-3.5 w-3.5 text-amber-400" />
              <span>Clave de Transmisión (Stream Key)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                type="password"
                value={result.streamKey}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 font-mono text-xs text-zinc-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(result.streamKey, "key")}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
              >
                {copiedField === "key" ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar Clave</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-zinc-950/60 p-3.5 text-[11px] leading-relaxed text-zinc-400 border border-zinc-800/60">
          ℹ️ <strong>Importante:</strong> Esta clave es única para esta sesión. Cuando inicies emisión en OBS, Mux detectará la señal y el estado cambiará a <strong>EN DIRECTO</strong> automáticamente.
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-md shadow-xl"
    >
      <div className="border-b border-zinc-800/60 pb-4">
        <h2 className="text-lg font-bold text-zinc-50">Configurar nueva transmisión</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Completá el título y categoría para habilitar el canal RTMP seguro.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Título de la transmisión
        </label>
        <input
          name="title"
          placeholder="Ej: Debate Doctrinario Territorial - UB San Martín"
          required
          minLength={3}
          maxLength={140}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Categoría doctrinaria
        </label>
        <select
          name="categoria"
          defaultValue=""
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 focus:border-sky-500 focus:outline-none"
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
        <div className="flex items-center gap-2 rounded-xl bg-red-950/60 p-3.5 text-xs text-red-300 border border-red-800/60">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition hover:scale-105 disabled:opacity-50"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Generando credenciales Mux...</span>
          </>
        ) : (
          <>
            <Radio className="h-4 w-4" />
            <span>Generar datos de emisión</span>
          </>
        )}
      </button>
    </form>
  );
}
