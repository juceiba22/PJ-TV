"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { VEINTE_VERDADES } from "@/lib/doctrina";

// Verdades destacadas al inicio; el resto se despliega.
const DESTACADAS = [18, 20, 6, 4, 9, 12];

export function VeinteVerdades() {
  const [abiertas, setAbiertas] = useState(false);
  const orden = abiertas
    ? VEINTE_VERDADES.map((_, i) => i + 1)
    : DESTACADAS;

  return (
    <div className="flex flex-col gap-6">
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orden.map((n) => (
          <li
            key={n}
            className="group relative flex gap-4 overflow-hidden rounded-2xl border border-sky-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-900/10"
          >
            <span className="font-display text-5xl leading-none text-sky-300 transition group-hover:text-blue-600">
              {String(n).padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed text-zinc-200">{VEINTE_VERDADES[n - 1]}</p>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setAbiertas((v) => !v)}
        className="mx-auto flex items-center gap-2 rounded-xl border-2 border-blue-600 bg-white px-5 py-2.5 font-display text-base uppercase tracking-wider text-blue-600 transition hover:bg-sky-50"
      >
        {abiertas ? (
          <>
            Ver menos <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            Leer las 20 Verdades <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
