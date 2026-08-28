"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { createClient } from "@/lib/supabase/client";

interface StreamPlayerProps {
  streamId: string;
  initialStatus: string;
  initialPlaybackId: string | null;
  title: string;
}

export function StreamPlayer({
  streamId,
  initialStatus,
  initialPlaybackId,
  title,
}: StreamPlayerProps) {
  const [status, setStatus] = useState(initialStatus);
  const [playbackId, setPlaybackId] = useState<string | null>(initialPlaybackId);
  const supabase = createClient();

  useEffect(() => {
    // Suscribirse a cambios en tiempo real en la fila de este stream
    const channel = supabase
      .channel(`stream-status:${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "streams",
          filter: `id=eq.${streamId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            status: string;
            mux_playback_id?: string | null;
          };

          if (row.status) {
            setStatus(row.status);
          }
          if (row.mux_playback_id) {
            setPlaybackId(row.mux_playback_id);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId, supabase]);

  if (status === "active" && playbackId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          En Vivo
        </div>
        <MuxPlayer
          playbackId={playbackId}
          streamType="live"
          autoPlay
          title={title}
          className="h-full w-full"
        />
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl bg-neutral-900 p-6 text-center text-white shadow-inner">
        <span className="mb-2 text-3xl">⏹️</span>
        <h3 className="text-lg font-bold">Transmisión finalizada</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Esta emisión en vivo ha concluido. ¡Gracias por participar!
        </p>
      </div>
    );
  }

  // Estado por defecto: 'idle' (esperando señal)
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-center text-white shadow-inner">
      <div className="relative mb-4 flex items-center justify-center">
        <span className="absolute h-12 w-12 rounded-full bg-blue-500/20 animate-ping" />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
          📡
        </span>
      </div>
      <h3 className="text-lg font-bold">Esperando señal de transmisión</h3>
      <p className="mt-2 max-w-md text-sm text-neutral-400">
        El referente todavía no conectó su software de emisión (OBS). En cuanto comience a transmitir, el reproductor se iniciará automáticamente aquí.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
        <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
        Escuchando en tiempo real con Supabase
      </div>
    </div>
  );
}
