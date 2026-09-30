import Link from "next/link";
import { getLiveStreams } from "@/lib/queries/streams";
import { CATEGORIAS, categoriaLabel } from "@/lib/categorias";
import { streamThumbnail } from "@/lib/video";
import {
  Radio,
  Tv,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  Flame,
  MessageSquare,
  Users,
} from "lucide-react";

const FILTROS = [{ slug: "", label: "Todos los Streams" }, ...CATEGORIAS];

export default async function EnVivoPage({ searchParams }: PageProps<"/en-vivo">) {
  const params = await searchParams;
  const provincia = typeof params.provincia === "string" ? params.provincia : undefined;
  const categoria = typeof params.categoria === "string" ? params.categoria : undefined;

  const streams = await getLiveStreams({ provincia, categoria });
  const featuredStream = streams.length > 0 ? streams[0] : null;
  const otherStreams = streams.length > 1 ? streams.slice(1) : [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
      {/* Hero Section */}
      {featuredStream ? (
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-10 shadow-2xl">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 -mb-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/40 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Transmisión Destacada
                </span>
                {featuredStream.categoria && (
                  <span className="rounded-full border border-zinc-700/60 bg-zinc-800/80 px-3 py-1 text-xs font-medium text-zinc-300">
                    {categoriaLabel(featuredStream.categoria)}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-black tracking-tight text-zinc-50 sm:text-4xl">
                {featuredStream.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow">
                    {featuredStream.referente_username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-zinc-200">
                    @{featuredStream.referente_username}
                  </span>
                </div>
                {featuredStream.provincia && (
                  <div className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" />
                    <span>{featuredStream.provincia}</span>
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center gap-3">
                <Link
                  href={`/stream/${featuredStream.id}`}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:scale-105 hover:shadow-blue-600/50"
                >
                  <Tv className="h-4 w-4" />
                  <span>Unirse al vivo ahora</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Video preview teaser card */}
            <div className="lg:col-span-5">
              <Link
                href={`/stream/${featuredStream.id}`}
                className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-950 shadow-2xl transition hover:border-sky-500/80"
              >
                {streamThumbnail(featuredStream) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={streamThumbnail(featuredStream)!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 text-white shadow-2xl shadow-red-600/50 transition group-hover:scale-110">
                    <Radio className="h-7 w-7 animate-pulse" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                  <span className="font-semibold">Señal en vivo</span>
                  <span className="rounded bg-black/60 px-2 py-0.5 backdrop-blur-sm">
                    🔴 HD en directo
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* Welcome Banner when no stream is live */
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 p-8 sm:p-12 shadow-2xl text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.15),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Plataforma de Militancia y Formación Justicialista</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-50 sm:text-5xl">
              La voz y el debate de todas las <span className="bg-gradient-to-r from-sky-400 to-amber-300 bg-clip-text text-transparent">Unidades Básicas</span>
            </h1>
            <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
              Conectate con transmisiones en vivo desde cada rincón del país, participá en los debates doctrinarios y obtené tu Carnet Digital de Afiliado.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/foros"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-105"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Explorar Foros</span>
              </Link>
              <Link
                href="/perfil"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-zinc-50"
              >
                <Users className="h-4 w-4 text-amber-400" />
                <span>Mi Carnet Digital</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categorías Doctrinarias Chips */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-zinc-300">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>Categorías Doctrinarias</span>
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTROS.map((c) => {
            const isSelected = (categoria ?? "") === c.slug;
            return (
              <Link
                key={c.slug}
                href={c.slug ? `/en-vivo?categoria=${c.slug}` : "/en-vivo"}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-sky-500 text-zinc-950 shadow-md shadow-sky-500/30 font-bold"
                    : "border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Streams Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-zinc-50">
            {categoria ? `Transmisiones sobre ${categoriaLabel(categoria)}` : "Todas las transmisiones en directo"}
          </h2>
          <span className="text-xs text-zinc-500">
            {streams.length} {streams.length === 1 ? "emisión activa" : "emisiones activas"}
          </span>
        </div>

        {streams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-12 text-center">
            <Radio className="mb-3 h-10 w-10 text-zinc-600" />
            <p className="text-base font-semibold text-zinc-300">
              No hay transmisiones activas en este momento
            </p>
            <p className="mt-1 max-w-sm text-xs text-zinc-500">
              Cuando una Unidad Básica o referente inicie transmisión desde OBS, aparecerá automáticamente aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {streams.map((s) => (
              <Link
                key={s.id}
                href={`/stream/${s.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 transition duration-200 hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-xl hover:shadow-sky-500/10"
              >
                {/* 16:9 Thumbnail container */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-zinc-950 via-zinc-900 to-zinc-950">
                    <Radio className="h-8 w-8 text-zinc-700 transition group-hover:scale-110 group-hover:text-red-500" />
                  </div>
                  {streamThumbnail(s) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={streamThumbnail(s)!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100" />
                  )}
                  <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-sm animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    En Vivo
                  </div>
                  {s.categoria && (
                    <div className="absolute bottom-2.5 left-2.5 z-10 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm border border-zinc-800">
                      {categoriaLabel(s.categoria)}
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="line-clamp-2 text-base font-bold text-zinc-100 transition group-hover:text-sky-400">
                      {s.title}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/30 text-[10px] font-bold text-sky-400">
                        {s.referente_username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-zinc-300">
                        @{s.referente_username}
                      </span>
                    </div>

                    {s.provincia && (
                      <div className="flex items-center gap-1 text-zinc-400">
                        <MapPin className="h-3 w-3 text-sky-400" />
                        <span>{s.provincia}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
