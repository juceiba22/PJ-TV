"use client";

import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Printer, Share2, User } from "lucide-react";
import { useState } from "react";

export interface CarnetData {
  nombre: string;
  username: string;
  role: string;
  numeroAfiliado: string | null;
  fechaAfiliacion: string | null;
  localidad: string | null;
  avatarUrl?: string | null;
}

function SolPeronista({ className = "h-5 w-5" }: { className?: string }) {
  // Sol de Mayo estilizado
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g fill="currentColor">
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d={i % 2 === 0 ? "M32 2 L35 16 L29 16 Z" : "M32 6 Q36 12 32 16 Q28 12 32 6 Z"}
            transform={`rotate(${i * 22.5} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="12" />
      </g>
    </svg>
  );
}

export function CarnetDigital({ data }: { data: CarnetData }) {
  const [copied, setCopied] = useState(false);
  const qrValue = `PJTV|AFILIADO|${data.numeroAfiliado ?? ""}|${data.nombre}`;

  async function share() {
    const text = `Me afilié al Partido Justicialista desde PJ TV. Nº ${data.numeroAfiliado}`;
    try {
      if (navigator.share) await navigator.share({ title: "Mi carnet PJ", text, url: window.location.origin });
      else {
        await navigator.clipboard.writeText(`${text} — ${window.location.origin}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // el usuario canceló
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        id="carnet-print"
        className="relative aspect-[1.586/1] w-full max-w-md overflow-hidden rounded-2xl border-2 border-amber-300/90 bg-gradient-to-br from-sky-700 via-sky-900 to-slate-950 p-5 text-white shadow-[0_15px_40px_rgba(56,189,248,0.25)]"
      >
        {/* franjas celeste y blanca de fondo */}
        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-1/3 bg-white/[0.06]" />
        <SolPeronista className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 text-amber-300/10" />

        <div className="relative z-10 flex items-center justify-between border-b border-amber-300/40 pb-2.5">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/pj-escudo.svg" alt="" className="h-10 w-10 drop-shadow" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">Partido Justicialista</h3>
              <p className="text-[9px] font-semibold tracking-wider text-amber-200">CREDENCIAL DIGITAL DE AFILIACIÓN</p>
            </div>
          </div>
          <span className="rounded border border-amber-300/50 bg-amber-300/15 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-200">
            PJ TV
          </span>
        </div>

        <div className="relative z-10 mt-3 flex items-center gap-3.5">
          <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-amber-300/70 bg-sky-950/70">
            {data.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-amber-300">
                {(data.nombre || data.username).charAt(0).toUpperCase() || <User className="h-8 w-8" />}
              </span>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-200">
              {data.role === "referente" ? "Referente Territorial" : "Afiliado/a"}
            </span>
            <h4 className="truncate text-base font-black uppercase tracking-tight sm:text-lg">{data.nombre}</h4>
            <p className="truncate text-[11px] text-sky-100/80">{data.localidad ?? `@${data.username}`}</p>
          </div>
          <div className="shrink-0 rounded-lg bg-white p-1.5 shadow">
            <QRCodeSVG value={qrValue} size={58} level="M" />
          </div>
        </div>

        <div className="relative z-10 mt-3 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/30 p-2.5">
          <div>
            <span className="block text-[8px] font-bold uppercase tracking-wider text-sky-200/80">Nº de afiliación</span>
            <span className="font-mono text-xs font-bold text-amber-200">{data.numeroAfiliado ?? "---"}</span>
          </div>
          <div>
            <span className="block text-[8px] font-bold uppercase tracking-wider text-sky-200/80">Fecha de alta</span>
            <span className="font-mono text-xs font-bold">
              {data.fechaAfiliacion ? new Date(data.fechaAfiliacion).toLocaleDateString("es-AR", { timeZone: "UTC" }) : "---"}
            </span>
          </div>
        </div>

        <div className="relative z-10 mt-2 flex items-center justify-between text-[8px] text-sky-100/70">
          <span className="font-mono tracking-widest">JUSTICIA SOCIAL · INDEPENDENCIA ECONÓMICA · SOBERANÍA POLÍTICA</span>
          <span className="flex items-center gap-1 font-bold text-emerald-300">
            <CheckCircle2 className="h-2.5 w-2.5" />
            ACTIVA
          </span>
        </div>
      </div>

      <div className="flex gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-sky-500/60"
        >
          <Printer className="h-3.5 w-3.5" />
          Descargar / Imprimir
        </button>
        <button
          type="button"
          onClick={share}
          className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-500"
        >
          <Share2 className="h-3.5 w-3.5" />
          {copied ? "¡Copiado!" : "Compartir"}
        </button>
      </div>
    </div>
  );
}
