"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  author: { username: string } | null;
}

export function LiveChat({
  streamId,
  initialMessages,
  currentUser,
}: {
  streamId: string;
  initialMessages: ChatMessage[];
  currentUser: { id: string; username: string } | null;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${streamId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `stream_id=eq.${streamId}` },
        async (payload) => {
          const row = payload.new as {
            id: string;
            message: string;
            created_at: string;
            user_id: string;
          };

          const { data: author } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", row.user_id)
            .single();

          setMessages((prev) => [...prev, { ...row, author: author ?? null }]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId, supabase]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !currentUser) return;

    const { error: insertError } = await supabase.from("chat_messages").insert({
      stream_id: streamId,
      user_id: currentUser.id,
      message: draft.trim(),
    });

    if (insertError) {
      setError("No se pudo enviar el mensaje (¿estás baneado de este chat?).");
    } else {
      setError(null);
      setDraft("");
    }
  }

  return (
    <div className="flex h-[32rem] flex-col rounded-lg border border-neutral-200 dark:border-neutral-800">
      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => (
          <p key={m.id} className="text-sm">
            <span className="font-semibold">@{m.author?.username ?? "usuario"}: </span>
            {m.message}
          </p>
        ))}
      </div>
      {currentUser ? (
        <form onSubmit={sendMessage} className="flex gap-2 border-t border-neutral-200 p-2 dark:border-neutral-800">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={500}
            placeholder="Escribí un mensaje..."
            className="flex-1 rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
          />
          <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
            Enviar
          </button>
        </form>
      ) : (
        <p className="border-t border-neutral-200 p-2 text-center text-sm text-neutral-500 dark:border-neutral-800">
          Ingresá para chatear.
        </p>
      )}
      {error && <p className="px-2 pb-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
