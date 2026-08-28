import { notFound } from "next/navigation";
import { getStreamById } from "@/lib/queries/streams";
import { getCurrentProfile } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { LiveChat } from "@/components/live-chat";
import { StreamPlayer } from "@/components/stream-player";

export default async function StreamPage({ params }: PageProps<"/stream/[id]">) {
  const { id } = await params;
  const stream = await getStreamById(id);
  if (!stream) notFound();

  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data: initialMessages } = await supabase
    .from("chat_messages")
    .select("id, message, created_at, user_id, author:profiles(username)")
    .eq("stream_id", id)
    .order("created_at", { ascending: true })
    .limit(200);

  const messages = (initialMessages ?? []).map((m) => ({
    ...m,
    author: Array.isArray(m.author) ? m.author[0] : m.author,
  }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 lg:flex-row">
      <div className="flex-1">
        <StreamPlayer
          streamId={stream.id}
          initialStatus={stream.status}
          initialPlaybackId={stream.mux_playback_id}
          title={stream.title}
        />
        <h1 className="mt-4 text-xl font-bold">{stream.title}</h1>
        <p className="text-sm text-neutral-500">
          @{stream.referente?.username}
          {stream.categoria ? ` · ${stream.categoria}` : ""}
        </p>
        {stream.description && <p className="mt-2 text-sm">{stream.description}</p>}
      </div>

      <div className="w-full lg:w-80">
        <LiveChat
          streamId={id}
          initialMessages={messages}
          currentUser={profile ? { id: profile.id, username: profile.username } : null}
        />
      </div>
    </main>
  );
}
