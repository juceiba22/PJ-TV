export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function streamThumbnail(s: { video_url: string | null; mux_playback_id: string | null }) {
  const yt = getYouTubeId(s.video_url);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  if (s.mux_playback_id) return `https://image.mux.com/${s.mux_playback_id}/thumbnail.jpg?width=640`;
  return null;
}
