import Link from "next/link";
import { notFound } from "next/navigation";
import { getStreamById } from "@/lib/queries/streams";
import { getCurrentProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { LiveChat } from "@/components/live-chat";
import { StreamPlayer } from "@/components/stream-player";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Tag,
  Radio,
  Share2,
} from "lucide-react";

export default async function StreamPage({ params }: PageProps<"/stream/[id]">) {
  const { id } = await params;
  const stream = await getStreamById(id);
  if (!stream) notFound();

  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data: initialMessages } = await supabase
    .from("chat_messages")
    .select("id, message, created_at, user_id, author:profiles(username, role)")
    .eq("stream_id", id)
    .order("created_at", { ascending: true })
    .limit(200);

  const messages = (initialMessages ?? []).map((m) => ({
    ...m,
    author: Array.isArray(m.author) ? m.author[0] : m.author,
  }));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
      {/* Top Bar / Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a las transmisiones</span>
        </Link>

        <div className="flex items-center gap-2">
          {stream.status === "active" && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              En Directo
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Stream Player + Chat */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Player & Metadata */}
        <div className="flex flex-col gap-5 lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-2xl">
            <StreamPlayer
              streamId={stream.id}
              initialStatus={stream.status}
              initialPlaybackId={stream.mux_playback_id}
              title={stream.title}
            />
          </div>

          {/* Stream Metadata Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {stream.categoria && (
                    <span className="rounded-md border border-zinc-700/60 bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
                      {stream.categoria}
                    </span>
                  )}
                </div>

                <h1 className="text-xl font-black text-white sm:text-2xl">
                  {stream.title}
                </h1>
              </div>
            </div>

            {/* Referente details */}
            <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 font-bold text-white shadow-md">
                  {stream.referente?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-100">
                      @{stream.referente?.username}
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded bg-amber-950/80 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-300 border border-amber-700/60">
                      <ShieldCheck className="h-3 w-3" />
                      Referente UB
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Emisor verificado de PJ TV</p>
                </div>
              </div>
            </div>

            {stream.description && (
              <div className="mt-4 rounded-xl bg-zinc-950/40 p-4 border border-zinc-800/40">
                <p className="text-sm leading-relaxed text-zinc-300">
                  {stream.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Chat */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <LiveChat
              streamId={id}
              initialMessages={messages}
              currentUser={
                profile
                  ? { id: profile.id, username: profile.username, role: profile.role }
                  : null
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
