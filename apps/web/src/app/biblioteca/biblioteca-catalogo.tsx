"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIAS_BIBLIOTECA, type Recurso } from "@/lib/biblioteca";
import { BookOpen, ExternalLink, FileText, Search, Star } from "lucide-react";

const TIPO_LABEL = { pdf: "PDF", enlace: "Web", texto: "Lectura" } as const;
const TIPO_ICON = { pdf: FileText, enlace: ExternalLink, texto: BookOpen } as const;

export function BibliotecaCatalogo({ recursos }: { recursos: Recurso[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  const filtrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    return recursos.filter(
      (r) =>
        (!cat || r.categoria === cat) &&
        (!term ||
          r.titulo.toLowerCase().includes(term) ||
          r.autor.toLowerCase().includes(term) ||
          r.descripcion.toLowerCase().includes(term)),
    );
  }, [recursos, q, cat]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, autor o tema..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-3.5 text-sm text-zinc-50 placeholder-zinc-600 focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["", ...CATEGORIAS_BIBLIOTECA].map((c) => (
          <button
            key={c || "todas"}
            type="button"
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              cat === c
                ? "bg-sky-500 font-bold text-zinc-950"
                : "border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            {c || "Todo el catálogo"}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-sm text-zinc-500">
          No encontramos material con ese criterio.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((r) => {
            const Icon = TIPO_ICON[r.tipo];
            return (
              <Link
                key={r.slug}
                href={`/biblioteca/${r.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 transition duration-200 hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-xl hover:shadow-sky-500/10"
              >
                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
                  {r.portada ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.portada} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
                  ) : (
                    <div className="px-6 text-center">
                      <Icon className="mx-auto mb-2 h-7 w-7 text-amber-300/80" />
                      <p className="line-clamp-2 font-serif text-lg font-bold leading-snug text-zinc-50/90">{r.titulo}</p>
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {TIPO_LABEL[r.tipo]}
                  </span>
                  {r.destacado && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-amber-400/90 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-950">
                      <Star className="h-3 w-3" />
                      Destacado
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">{r.categoria}</span>
                  <h3 className="text-base font-bold text-zinc-100 transition group-hover:text-sky-300">{r.titulo}</h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">{r.descripcion}</p>
                  <p className="mt-auto pt-3 text-[11px] text-zinc-500">
                    {r.autor}
                    {r.anio ? ` · ${r.anio}` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
