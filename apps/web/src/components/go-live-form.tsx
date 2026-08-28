"use client";

import { useActionState } from "react";
import { createLiveStream } from "@/app/actions/streams";

const CATEGORIAS = [
  { slug: "independencia-economica", label: "Independencia Económica" },
  { slug: "justicia-social", label: "Justicia Social" },
  { slug: "soberania-politica", label: "Soberanía Política" },
];

export function GoLiveForm() {
  const [state, action, pending] = useActionState(createLiveStream, undefined);
  const result = state && "rtmpUrl" in state ? state : null;
  const error = state && "error" in state ? state.error : null;

  if (result) {
    return (
      <div className="rounded-lg border border-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
        <p className="mb-2 font-semibold">"{result.title}" está lista para transmitir</p>
        <p className="mb-1 text-sm">
          Configurá OBS Studio (o tu software de streaming) con estos datos:
        </p>
        <dl className="mb-2 text-sm">
          <dt className="font-medium">URL del servidor (RTMP)</dt>
          <dd className="mb-2 break-all font-mono">{result.rtmpUrl}</dd>
          <dt className="font-medium">Clave de transmisión (stream key)</dt>
          <dd className="break-all font-mono">{result.streamKey}</dd>
        </dl>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Guardá esta clave ahora: no se va a volver a mostrar. Cuando conectes OBS, tu
          stream va a aparecer automáticamente como en vivo en la Home.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="font-semibold">Ir en vivo</h2>
      <input
        name="title"
        placeholder="Título de la transmisión"
        required
        className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
      />
      <select
        name="categoria"
        defaultValue=""
        className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700"
      >
        <option value="">Sin categoría</option>
        {CATEGORIAS.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded bg-red-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {pending ? "Generando..." : "Ir en vivo"}
      </button>
    </form>
  );
}
