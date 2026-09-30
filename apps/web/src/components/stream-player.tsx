"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { getYouTubeId } from "@/lib/video";
import { createClient } from "@/lib/supabase/client";
import { Radio, Wifi, StopCircle, CheckCircle2, Sparkles } from "lucide-react";

interface StreamPlayerProps {
  streamId: string;
  initialStatus: string;
  initialPlaybackId: string | null;
  title: string;
  videoUrl?: string | null;
}

export function StreamPlayer({
  streamId,
  initialStatus,
  initialPlaybackId,
  title,
  videoUrl,
}: StreamPlayerProps) {
  const [status, setStatus] = useState(initialStatus);
  const [playbackId, setPlaybackId] = useState<string | null>(initialPlaybackId);
  const supabase = createClient();

  useEffect(() => {
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

  if (status === "active" && videoUrl) {
    const youtubeId = getYouTubeId(videoUrl);
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-sm animate-pulse">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span>En Directo</span>
        </div>
        {youtubeId ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={videoUrl} className="h-full w-full" autoPlay muted loop controls playsInline />
        )}
      </div>
    );
  }

  if (status === "active" && playbackId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg backdrop-blur-sm animate-pulse">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span>En Directo</span>
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
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-zinc-950 p-6 text-center text-white shadow-2xl border border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500 mb-3 border border-zinc-800">
          <StopCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-zinc-200">Transmisión finalizada</h3>
        <p className="mt-1 text-xs text-zinc-400 max-w-sm">
          Esta emisión en vivo ha concluido. Podés continuar debatiendo en los foros doctrinarios.
        </p>
      </div>
    );
  }

  // Estado por defecto: 'idle' (esperando señal de OBS)
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950 p-6 text-center text-white shadow-2xl">
      <div className="relative mb-4 flex items-center justify-center">
        <span className="absolute h-14 w-14 rounded-full bg-sky-500/20 animate-ping" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/40">
          <Wifi className="h-5 w-5 animate-pulse" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-zinc-100">Esperando señal de transmisión</h3>
      <p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-400">
        El referente todavía no inició la emisión en OBS Studio. En cuanto comience, el reproductor se activará automáticamente sin recargar la página.
      </p>
      <div className="mt-5 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 py-1.5 text-xs text-zinc-400">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        <span className="text-[11px] font-medium">Sincronización Realtime activa</span>
      </div>
    </div>
  );
}

