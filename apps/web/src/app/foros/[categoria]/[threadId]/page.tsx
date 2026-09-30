import Link from "next/link";
import { notFound } from "next/navigation";
import { getThreadWithPosts, getLikeInfo } from "@/lib/queries/forums";
import { createPost } from "@/app/actions/forum";
import { getCurrentProfile } from "@/lib/dal";
import { GuestGate } from "@/components/guest-gate";
import { LikeButton } from "@/components/like-button";
import {
  ArrowLeft,
  MessageSquare,
  Video,
  FileText,
  MapPin,
  Clock,
  ExternalLink,
  Send,
  User,
  ShieldCheck,
} from "lucide-react";

export default async function ThreadPage({
  params,
}: PageProps<"/foros/[categoria]/[threadId]">) {
  const { categoria: slug, threadId } = await params;

  const result = await getThreadWithPosts(threadId);
  if (!result) notFound();
  const { thread, posts } = result;

  const profile = await getCurrentProfile();
  const likeInfo = await getLikeInfo(
    "post",
    posts.map((p) => p.id),
    profile?.id,
  );
  const path = `/foros/${slug}/${threadId}`;

  const isVideo = thread.instrumento_tipo === "video";
  const isDocument = thread.instrumento_tipo === "documento";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      {/* Top Navigation */}
      <div>
        <Link
          href={`/foros/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al listado de debates</span>
        </Link>
      </div>

      {/* Main Thread Card */}
      <article className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {thread.instrumento_tipo && thread.instrumento_tipo !== "texto" && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-950/80 px-2.5 py-0.5 text-xs font-bold uppercase text-sky-300 border border-sky-800/60">
              {isVideo ? <Video className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
              {thread.instrumento_tipo}
            </span>
          )}
          {thread.provincia && (
            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <MapPin className="h-3 w-3 text-sky-400" />
              {thread.provincia}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-black text-white sm:text-3xl">
          {thread.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 border-b border-zinc-800/60 pb-6 text-xs text-zinc-400">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/30 text-xs font-bold text-sky-400">
            {thread.author?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-zinc-200">@{thread.author?.username}</span>
            <span className="mx-2 text-zinc-600">·</span>
            <span>
              {new Date(thread.created_at).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Renderizado de instrumento (Video / Documento) */}
        {thread.instrumento_url && (
          <div className="mt-6">
            {isVideo && thread.instrumento_url.includes("youtube.com/watch?v=") ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${new URL(
                    thread.instrumento_url,
                  ).searchParams.get("v")}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : isVideo && thread.instrumento_url.includes("youtu.be/") ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${thread.instrumento_url.split("youtu.be/")[1]?.split("?")[0]}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-sky-500/30 bg-sky-950/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/20 text-sky-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Recurso adjunto al debate</h3>
                    <p className="text-xs text-zinc-400 truncate max-w-sm sm:max-w-md">
                      {thread.instrumento_url}
                    </p>
                  </div>
                </div>
                <a
                  href={thread.instrumento_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-sky-500"
                >
                  <span>Abrir recurso</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        )}
      </article>

      {/* Sección de Respuestas / Aportes */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <MessageSquare className="h-4 w-4 text-sky-400" />
            <span>Aportes de la Militancia ({posts.length})</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {posts.map((p) => {
            const likes = likeInfo.get(p.id) ?? { count: 0, likedByMe: false };

            return (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-sky-400 border border-zinc-700">
                      {p.author?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-zinc-200">
                      @{p.author?.username}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(p.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <LikeButton
                    targetType="post"
                    targetId={p.id}
                    count={likes.count}
                    likedByMe={likes.likedByMe}
                    revalidatePath={path}
                  />
                </div>

                <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap pl-1">
                  {p.body}
                </p>
              </div>
            );
          })}

          {posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-xs text-zinc-500">
              Todavía no hay aportes en este debate. ¡Sé el primero en compartir tu postura!
            </div>
          )}
        </div>

        {/* Formulario de Respuesta */}
        {profile ? (
          <form action={createPost} className="mt-4 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <input type="hidden" name="thread_id" value={threadId} />
            <input type="hidden" name="category_slug" value={slug} />
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Tu aporte al debate
            </label>
            <textarea
              name="body"
              required
              rows={3}
              placeholder="Escribí tus argumentos o reflexiones doctrinarias..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 self-start rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 transition hover:scale-105"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Enviar aporte</span>
            </button>
          </form>
        ) : (
          <GuestGate message="Sumá tu aporte con un apodo, sin registrarte" />
        )}
      </section>
    </main>
  );
}
