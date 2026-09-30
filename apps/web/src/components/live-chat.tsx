"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GuestGate } from "@/components/guest-gate";
import {
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  author: { username: string; role?: string } | null;
}

export function LiveChat({
  streamId,
  initialMessages,
  currentUser,
}: {
  streamId: string;
  initialMessages: ChatMessage[];
  currentUser: { id: string; username: string; role?: string } | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `stream_id=eq.${streamId}`,
        },
        async (payload) => {
          const row = payload.new as {
            id: string;
            message: string;
            created_at: string;
            user_id: string;
          };

          const { data: author } = await supabase
            .from("profiles")
            .select("username, role")
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
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !currentUser || sending) return;

    setSending(true);
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
    setSending(false);
  }

  return (
    <div className="flex h-[32rem] flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-bold text-zinc-50">Chat en Vivo</h3>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Conectado
        </span>
      </div>

      {/* Messages Feed */}
      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
            <Sparkles className="mb-2 h-6 w-6 text-zinc-600" />
            <p className="text-xs">¡Sé el primero en enviar un mensaje a la militancia!</p>
          </div>
        ) : (
          messages.map((m) => {
            const isReferente = m.author?.role === "referente";
            const isCurrentUser = currentUser?.id === m.user_id;

            return (
              <div key={m.id} className="flex flex-col gap-0.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-semibold ${
                      isReferente
                        ? "text-amber-400"
                        : isCurrentUser
                        ? "text-sky-400"
                        : "text-zinc-300"
                    }`}
                  >
                    @{m.author?.username ?? "compañero"}
                  </span>

                  {isReferente && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-amber-950/80 px-1.5 py-0.2 text-[9px] font-black uppercase text-amber-300 border border-amber-700/60">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      UB
                    </span>
                  )}
                </div>
                <p className="rounded-lg bg-zinc-950/50 px-2.5 py-1.5 text-zinc-200 break-words border border-zinc-800/40 leading-relaxed">
                  {m.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Input */}
      <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-3">
        {currentUser ? (
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={500}
              placeholder="Escribí un mensaje..."
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-50 placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        ) : (
          <GuestGate compact message="Escribí en el chat con un apodo, sin registrarte" />
        )}
        {error && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
