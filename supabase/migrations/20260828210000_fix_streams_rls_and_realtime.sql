-- Permitir lectura pública de streams sin importar si están idle, active o ended
drop policy if exists "streams_select_active" on public.streams;
create policy "streams_select_public" on public.streams for select using (true);

-- Habilitar identidad completa de réplica para que Supabase Realtime propague los UPDATEs bajo RLS
alter table public.streams replica identity full;
