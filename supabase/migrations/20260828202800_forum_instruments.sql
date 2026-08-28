-- Modificar tabla forum_threads para soportar tipos de instrumento
alter table public.forum_threads
  add column instrumento_tipo text not null default 'texto' check (instrumento_tipo in ('texto', 'video', 'documento')),
  add column instrumento_url text;

-- Semilla: Nuevas categorías
-- Insertamos o actualizamos las categorías
insert into public.forum_categories (slug, name, sort_order) values
  ('filosofia-justicialista', 'Filosofía Justicialista', 1),
  ('principios-doctrinarios', 'Principios Doctrinarios', 2),
  ('principios-politicos', 'Principios Políticos', 3),
  ('lineamientos-economicos', 'Lineamientos Económicos', 4),
  ('cultura', 'Cultura', 5)
on conflict (slug) do update set 
  name = excluded.name, 
  sort_order = excluded.sort_order;
