import { createClient } from "@/lib/supabase/server";

export interface LiveStreamCard {
  id: string;
  title: string;
  categoria: string | null;
  mux_playback_id: string | null;
  video_url: string | null;
  started_at: string | null;
  referente_username: string;
  provincia: string | null;
}

export async function getLiveStreams(filters: {
  provincia?: string;
  categoria?: string;
}): Promise<LiveStreamCard[]> {
  const supabase = await createClient();

  let query = supabase
    .from("streams")
    .select(
      "id, title, categoria, mux_playback_id, video_url, started_at, referente_id, referente:profiles!streams_referente_id_fkey(username)",
    )
    .eq("status", "active")
    .order("started_at", { ascending: false, nullsFirst: false });

  if (filters.categoria) query = query.eq("categoria", filters.categoria);

  const { data: streams } = await query;
  if (!streams || streams.length === 0) return [];

  const { data: publicDetails } = await supabase
    .from("referente_public")
    .select("user_id, provincia");

  const provinciaByUser = new Map(
    (publicDetails ?? []).map((d) => [d.user_id, d.provincia]),
  );

  return streams
    .map((s) => {
      const referente = Array.isArray(s.referente) ? s.referente[0] : s.referente;
      return {
        id: s.id,
        title: s.title,
        categoria: s.categoria,
        mux_playback_id: s.mux_playback_id,
        video_url: s.video_url,
        started_at: s.started_at,
        referente_username: referente?.username ?? "referente",
        provincia: provinciaByUser.get(s.referente_id) ?? null,
      };
    })
    // Oculta vivos "activos" sin señal de Mux ni video de respaldo (pruebas abandonadas)
    .filter((s) => s.mux_playback_id || s.video_url)
    // ...y vivos reales que quedaron "activos" hace más de 12 h (webhook de fin perdido)
    .filter(
      (s) =>
        s.video_url ||
        !s.started_at ||
        Date.now() - new Date(s.started_at).getTime() < 12 * 60 * 60 * 1000,
    )
    .filter((s) => !filters.provincia || s.provincia === filters.provincia);
}

export async function getStreamById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("streams")
    .select(
      "id, title, description, categoria, mux_playback_id, video_url, status, started_at, referente_id, referente:profiles!streams_referente_id_fkey(username)",
    )
    .eq("id", id)
    .single();

  if (!data) return null;

  const referente = Array.isArray(data.referente) ? data.referente[0] : data.referente;
  return { ...data, referente };
}

export async function getOwnStreams(referenteId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("streams")
    .select("id, title, categoria, status, started_at, ended_at, created_at")
    .eq("referente_id", referenteId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
