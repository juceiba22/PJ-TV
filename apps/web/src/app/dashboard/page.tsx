import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/dal";
import { getOwnStreams } from "@/lib/queries/streams";
import { GoLiveForm } from "@/components/go-live-form";
import {
  Radio,
  ShieldAlert,
  Tv,
  Calendar,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";

const STATUS_BADGE: Record<string, { label: string; className: string; dot: string }> = {
  idle: {
    label: "Esperando conexión OBS",
    className: "bg-amber-950/80 text-amber-300 border border-amber-700/60",
    dot: "bg-amber-400 animate-ping",
  },
  active: {
    label: "EN VIVO",
    className: "bg-red-950/90 text-red-200 border border-red-700 font-bold",
    dot: "bg-red-500 animate-pulse",
  },
  ended: {
    label: "Finalizado",
    className: "bg-zinc-900 text-zinc-400 border border-zinc-800",
    dot: "bg-zinc-600",
  },
};

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  // Si no tiene rol de referente, mostrar aviso claro y estado informativo
  if (profile.role !== "referente") {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12">
        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-zinc-900/60 to-zinc-950 p-8 text-zinc-200 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Acceso Restringido
              </span>
              <h1 className="text-xl font-black text-zinc-50">
                Sección reservada para Referentes de UB
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            Tu cuenta actual está registrada con el rol de{" "}
            <strong className="font-bold text-sky-400 uppercase">
              {profile.role}
            </strong>{" "}
            (@{profile.username}). La emisión de transmisiones en directo por PJ TV está reservada para referentes territoriales y responsables de Unidades Básicas autorizados.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              <Tv className="h-4 w-4" />
              <span>Ver transmisiones en vivo</span>
            </Link>
            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-zinc-800 hover:text-zinc-50"
            >
              <User className="h-4 w-4 text-amber-400" />
              <span>Ver mi Carnet Digital</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const streams = await getOwnStreams(profile.id);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>Estudio de Transmisión</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-50 sm:text-3xl">
            Mi Unidad Básica
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Generá credenciales RTMP para emitir en directo desde OBS Studio hacia la comunidad.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Referente: <strong>@{profile.username}</strong></span>
        </div>
      </div>

      {/* Formulario de Emisión */}
      <GoLiveForm />

      {/* Historial de Transmisiones */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-50">
            Historial de mis transmisiones
          </h2>
          <span className="text-xs text-zinc-500">{streams.length} registradas</span>
        </div>

        <div className="flex flex-col gap-3">
          {streams.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-10 text-center text-zinc-500">
              <Radio className="mb-2 h-8 w-8 text-zinc-600" />
              <p className="text-sm font-semibold text-zinc-300">
                Todavía no iniciaste ninguna transmisión
              </p>
              <p className="mt-1 max-w-sm text-xs text-zinc-500">
                Completá el formulario superior para generar los datos RTMP y conectar tu OBS.
              </p>
            </div>
          )}

          {streams.map((s) => {
            const badge =
              STATUS_BADGE[s.status] ?? STATUS_BADGE.ended;

            return (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm transition hover:border-zinc-700"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-zinc-50">{s.title}</h3>
                    {s.status === "active" && (
                      <Link
                        href={`/stream/${s.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 underline"
                      >
                        <span>Ver sala en vivo</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>

                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                      {s.categoria ?? "Sin categoría"}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Clock className="h-3 w-3" />
                      {new Date(s.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>

                <div className="self-start sm:self-auto shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${badge.className}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
