"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireReferente } from "@/lib/dal";

export type CreateStreamState =
  | { rtmpUrl: string; streamKey: string; playbackId: string | null; title: string }
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

  if (!session) return { error: "Tu sesión expiró, volvé a ingresar." };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
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
    rtmpUrl: data.rtmpUrl,
    streamKey: data.streamKey,
    playbackId: data.playbackId,
    title,
  };
}
