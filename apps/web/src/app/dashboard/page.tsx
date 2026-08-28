import { requireReferente } from "@/lib/dal";
import { getOwnStreams } from "@/lib/queries/streams";
import { GoLiveForm } from "@/components/go-live-form";

const STATUS_LABEL: Record<string, string> = {
  idle: "Sin conectar",
  active: "🔴 En vivo",
  ended: "Finalizado",
};

export default async function DashboardPage() {
  const profile = await requireReferente();
  const streams = await getOwnStreams(profile.id);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Mi Unidad Básica</h1>

      <GoLiveForm />

      <h2 className="mb-3 mt-10 text-lg font-semibold">Mis transmisiones</h2>
      <div className="flex flex-col gap-2">
        {streams.length === 0 && (
          <p className="text-neutral-500">Todavía no iniciaste ninguna transmisión.</p>
        )}
        {streams.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded border border-neutral-200 px-4 py-3 dark:border-neutral-800"
          >
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-neutral-500">{s.categoria ?? "sin categoría"}</p>
            </div>
            <span className="text-sm">{STATUS_LABEL[s.status] ?? s.status}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
