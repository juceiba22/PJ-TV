import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getThreads } from "@/lib/queries/forums";
import { createThread } from "@/app/actions/forum";
import { getCurrentProfile } from "@/lib/dal";
import { GuestGate } from "@/components/guest-gate";
import {
  ArrowLeft,
  MessageSquare,
  PlusCircle,
  Video,
  FileText,
  FileCode,
  MapPin,
  Clock,
  Sparkles,
  Link2,
} from "lucide-react";

const INSTRUMENT_BADGES: Record<
  string,
  { label: string; icon: any; className: string }
> = {
  video: {
    label: "Video",
    icon: Video,
    className: "bg-red-950/80 text-red-300 border-red-800/60",
  },
  documento: {
    label: "Documento",
    icon: FileText,
    className: "bg-blue-950/80 text-sky-300 border-sky-800/60",
  },
  texto: {
    label: "Debate",
    icon: MessageSquare,
    className: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
  },
};

export default async function CategoriaPage({
  params,
  searchParams,
}: PageProps<"/foros/[categoria]">) {
  const { categoria: slug } = await params;
  const { provincia } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const threads = await getThreads(
    category.id,
    typeof provincia === "string" ? provincia : undefined,
  );
  const profile = await getCurrentProfile();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/foros"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a todas las categorías</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Foro Doctrinario
            </span>
            <h1 className="text-2xl font-black text-zinc-50 sm:text-3xl">
              {category.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <MessageSquare className="h-4 w-4 text-amber-400" />
            <span>{threads.length} {threads.length === 1 ? "debate" : "debates"} en curso</span>
          </div>
        </div>
      </div>

      {/* Formulario de Creación de Hilo */}
      {profile ? (
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-zinc-50">
            <PlusCircle className="h-4 w-4 text-sky-400" />
            <span>Abrir nuevo debate o adjuntar recurso</span>
          </div>

          <form action={createThread} className="flex flex-col gap-4">
            <input type="hidden" name="category_id" value={category.id} />
            <input type="hidden" name="category_slug" value={category.slug} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <input
                  name="title"
                  placeholder="Título del debate o documento..."
                  required
                  minLength={3}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  name="provincia"
                  placeholder="Provincia (opcional)"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <select
                  name="instrumento_tipo"
                  defaultValue="texto"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 focus:border-sky-500 focus:outline-none"
                >
                  <option value="texto">💬 Texto / Debate Libre</option>
                  <option value="video">🎥 Video (YouTube / Vimeo)</option>
                  <option value="documento">📄 Documento (PDF / Drive)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <input
                  name="instrumento_url"
                  placeholder="URL del video o documento adjunto (opcional)..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-50 placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="self-start rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:scale-105"
            >
              Publicar debate
            </button>
          </form>
        </div>
      ) : (
        <GuestGate message="Abrí un debate con un apodo, sin registrarte" />
      )}

      {/* Lista de Debates Feed */}
      <div className="flex flex-col gap-3">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center text-zinc-500">
            <MessageSquare className="mb-3 h-8 w-8 text-zinc-600" />
            <p className="text-sm font-semibold text-zinc-300">
              Todavía no hay debates en esta categoría
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Sé el primero en abrir una discusión doctrinaria o compartir material.
            </p>
          </div>
        ) : (
          threads.map((t) => {
            const badge =
              INSTRUMENT_BADGES[t.instrumento_tipo ?? "texto"] ??
              INSTRUMENT_BADGES.texto;
            const Icon = badge.icon;

            return (
              <Link
                key={t.id}
                href={`/foros/${slug}/${t.id}`}
                className="group flex flex-col gap-2 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-sky-500/50 hover:bg-zinc-900/80 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base font-bold text-zinc-50 transition group-hover:text-sky-400">
                    {t.title}
                  </h2>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${badge.className}`}
                  >
                    <Icon className="h-3 w-3" />
                    {badge.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/40">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/30 text-[9px] font-bold text-sky-400">
                      {t.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-zinc-300">
                      @{t.author?.username}
                    </span>
                  </div>

                  {t.provincia && (
                    <div className="flex items-center gap-1 text-zinc-400">
                      <MapPin className="h-3 w-3 text-sky-400" />
                      <span>{t.provincia}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-zinc-500 ml-auto">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(t.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}
