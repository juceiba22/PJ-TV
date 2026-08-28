import Link from "next/link";
import { getLiveStreams } from "@/lib/queries/streams";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const provincia = typeof params.provincia === "string" ? params.provincia : undefined;
  const categoria = typeof params.categoria === "string" ? params.categoria : undefined;

  const streams = await getLiveStreams({ provincia, categoria });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Streams en vivo</h1>

      {streams.length === 0 ? (
        <p className="text-neutral-500">
          No hay transmisiones en vivo en este momento
          {provincia ? ` en ${provincia}` : ""}
          {categoria ? ` sobre ${categoria}` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map((s) => (
            <Link
              key={s.id}
              href={`/stream/${s.id}`}
              className="rounded-lg border border-neutral-200 p-4 transition hover:border-blue-500 dark:border-neutral-800"
            >
              <div className="mb-2 flex aspect-video items-center justify-center rounded bg-neutral-900 text-xs font-medium text-white">
                🔴 EN VIVO
              </div>
              <h2 className="font-semibold">{s.title}</h2>
              <p className="text-sm text-neutral-500">
                @{s.referente_username}
                {s.provincia ? ` · ${s.provincia}` : ""}
                {s.categoria ? ` · ${s.categoria}` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
