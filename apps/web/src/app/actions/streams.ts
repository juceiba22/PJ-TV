"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireReferente } from "@/lib/dal";
import { getYouTubeId } from "@/lib/video";

export type CreateStreamState =
  | {
      streamId: string;
      rtmpUrl: string;
      streamKey: string;
      playbackId: string | null;
      title: string;
    }
  | { error: string }
  | undefined;

export async function createLiveStream(
  _state: CreateStreamState,
  formData: FormData,
): Promise<CreateStreamState> {
  await requireReferente();

  const title = (formData.get("title") as string)?.trim();
  const categoria = (formData.get("categoria") as string) || undefined;
  if (!title) return { error: "El título es obligatorio." };

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { error: "Tu sesión expiró o no es válida. Volvé a ingresar." };
  }

  const apiUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001";

  const res = await fetch(`${apiUrl}/streams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ title, categoria }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: body?.message ?? "No se pudo crear la transmisión." };
  }

  const data = await res.json();
  revalidatePath("/dashboard");

  return {
    streamId: data.streamId,
    rtmpUrl: data.rtmpUrl,
    streamKey: data.streamKey,
    playbackId: data.playbackId,
    title,
  };
}

// ============================================================
// Transmisión por YouTube: el referente transmite a su canal de
// YouTube (OBS o celular) y pega el enlace; PJ TV lo inserta con
// el chat propio. Sin costo de streaming.
// ============================================================
export type YouTubeStreamState = { streamId: string; title: string } | { error: string } | undefined;

export async function createYouTubeStream(
  _state: YouTubeStreamState,
  formData: FormData,
): Promise<YouTubeStreamState> {
  const profile = await requireReferente();

  const title = (formData.get("title") as string)?.trim();
  const categoria = (formData.get("categoria") as string) || null;
  const url = (formData.get("youtube_url") as string)?.trim();

  if (!title) return { error: "El título es obligatorio." };
  if (!url || !getYouTubeId(url)) {
    return { error: "Pegá un enlace válido de YouTube (por ejemplo https://www.youtube.com/live/...)." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("streams")
    .insert({
      referente_id: profile.id,
      title,
      categoria,
      video_url: url,
      status: "active",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: `No se pudo publicar la transmisión: ${error?.message ?? "error desconocido"}` };
  }

  revalidatePath("/dashboard");
  revalidatePath("/en-vivo");
  revalidatePath("/");
  return { streamId: data.id, title };
}

export async function endStream(formData: FormData) {
  const profile = await requireReferente();
  const streamId = formData.get("stream_id") as string;
  if (!streamId) return;

  const supabase = await createClient();
  await supabase
    .from("streams")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", streamId)
    .eq("referente_id", profile.id);

  revalidatePath("/dashboard");
  revalidatePath("/en-vivo");
  revalidatePath("/");
}
