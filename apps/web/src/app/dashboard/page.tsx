import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/dal";
import { getOwnStreams } from "@/lib/queries/streams";
import { GoLiveForm } from "@/components/go-live-form";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  idle: {
    label: "Esperando conexión OBS",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
  },
  active: {
    label: "🔴 EN VIVO",
    className: "bg-red-100 text-red-800 animate-pulse font-bold dark:bg-red-900/50 dark:text-red-200",
  },
  ended: {
    label: "Finalizado",
    className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
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
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <h1 className="text-xl font-bold">Sección reservada para Referentes</h1>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Tu cuenta actual está registrada con el rol de <strong className="font-semibold uppercase">{profile.role}</strong> (@{profile.username}). 
            La emisión de transmisiones en vivo está reservada para referentes territoriales y responsables de Unidades Básicas autorizados.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Ver transmisiones en vivo
            </Link>
            <Link
              href="/perfil"
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Ver mi carnet y perfil
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const streams = await getOwnStreams(profile.id);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Panel de Transmisión — Mi Unidad Básica</h1>
        <p className="text-sm text-neutral-500">
          Creá y administrá tus emisiones en vivo para la comunidad de PJ TV.
        </p>
      </div>

      <GoLiveForm />

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Historial de transmisiones</h2>
        <div className="flex flex-col gap-3">
          {streams.length === 0 && (
            <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500 dark:border-neutral-700">
              Todavía no iniciaste ninguna transmisión. Usá el formulario superior para generar los datos de conexión RTMP para OBS Studio.
            </div>
          )}
          {streams.map((s) => {
            const badge = STATUS_BADGE[s.status] ?? {
              label: s.status,
              className: "bg-neutral-100 text-neutral-700",
            };
            return (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{s.title}</p>
                    {s.status === "active" && (
                      <Link
                        href={`/stream/${s.id}`}
                        className="text-xs text-blue-600 underline hover:text-blue-700"
                      >
                        (Ver stream público ↗)
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    {s.categoria ?? "Sin categoría"} · {new Date(s.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="self-start sm:self-auto">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badge.className}`}
                  >
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
