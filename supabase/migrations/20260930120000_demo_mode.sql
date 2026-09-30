-- PJ TV — modo demo: video de respaldo para transmisiones, alta robusta de
-- usuarios invitados y contenido de ejemplo (referentes, vivos, foros, chat).
-- Idempotente: se puede correr más de una vez sin duplicar datos.

-- ============================================================
-- 1. STREAMS: video de respaldo (YouTube o MP4) para vivos de demostración
-- ============================================================
alter table public.streams add column if not exists video_url text;
grant select (video_url) on public.streams to anon, authenticated;

-- ============================================================
-- 2. ALTA DE USUARIOS: username siempre presente y único
--    (los invitados y los accesos simulados no traen email real)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'compa'
  );
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := base_username || '_' || floor(random() * 9000 + 1000)::int;
  end loop;

  insert into public.profiles (id, username, role)
  values (
    new.id,
    final_username,
    case
      when new.raw_user_meta_data ->> 'role' = 'referente' then 'referente'
      else 'afiliado'
    end
  );
  return new;
end;
$$;

-- ============================================================
-- 3. USUARIOS DE DEMOSTRACIÓN (no pueden iniciar sesión: sin contraseña)
-- ============================================================
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select
  '00000000-0000-0000-0000-000000000000', u.id::uuid, 'authenticated', 'authenticated',
  u.email, '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('username', u.username, 'role', u.role, 'demo', true),
  now() - interval '30 days', now(), '', '', '', ''
from (values
  ('d0000000-0000-4000-8000-000000000001', 'ub.saltacapital@demo.pjtv.ar', 'ub_salta_capital', 'referente'),
  ('d0000000-0000-4000-8000-000000000002', 'ub.lanusoeste@demo.pjtv.ar',  'ub_lanus_oeste',   'referente'),
  ('d0000000-0000-4000-8000-000000000003', 'ub.oran@demo.pjtv.ar',        'ub_oran',          'referente'),
  ('d0000000-0000-4000-8000-000000000004', 'marta@demo.pjtv.ar',          'compa_marta',      'afiliado'),
  ('d0000000-0000-4000-8000-000000000005', 'juventud@demo.pjtv.ar',       'juventud_lanus',   'afiliado'),
  ('d0000000-0000-4000-8000-000000000006', 'docente@demo.pjtv.ar',        'docente_cafayate', 'afiliado'),
  ('d0000000-0000-4000-8000-000000000007', 'ricardo@demo.pjtv.ar',        'compa_ricardo',    'afiliado')
) as u(id, email, username, role)
on conflict (id) do nothing;

insert into public.referente_details (user_id, provincia, ciudad_municipio, barrio_direccion, nombre_unidad_basica) values
  ('d0000000-0000-4000-8000-000000000001', 'Salta',        'Salta Capital',            'Barrio Castañares', 'UB Eva Perón'),
  ('d0000000-0000-4000-8000-000000000002', 'Buenos Aires', 'Lanús',                    'Lanús Oeste',       'UB Compañero Néstor'),
  ('d0000000-0000-4000-8000-000000000003', 'Salta',        'San Ramón de la Nueva Orán', 'Barrio Pizarro',  'UB 17 de Octubre')
on conflict (user_id) do nothing;

-- ============================================================
-- 4. TRANSMISIONES DE DEMOSTRACIÓN (siempre "en vivo")
--    video_url: reemplazar por los videos definitivos cuando estén.
-- ============================================================
insert into public.streams (id, referente_id, title, description, categoria, status, started_at, video_url) values
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001',
   'Escuela de Formación: la Comunidad Organizada',
   'Clase abierta desde la UB Eva Perón de Salta Capital. Repasamos los fundamentos filosóficos del justicialismo y su vigencia en la provincia.',
   'filosofia-justicialista', 'active', now() - interval '25 minutes', null),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000002',
   'Plenario de la Juventud de Lanús',
   'Debate abierto sobre trabajo, producción y organización territorial en el conurbano sur.',
   'justicia-social', 'active', now() - interval '12 minutes', null),
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000003',
   'Soberanía y desarrollo en el Norte Grande',
   'Charla con compañeros de Orán sobre recursos estratégicos, litio y federalismo.',
   'soberania-politica', 'active', now() - interval '40 minutes', null)
on conflict (id) do nothing;

-- ============================================================
-- 5. CHAT DE EJEMPLO
-- ============================================================
insert into public.chat_messages (stream_id, user_id, message, created_at)
select m.stream_id::uuid, m.user_id::uuid, m.message, now() - (m.mins || ' minutes')::interval
from (values
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000004', '¡Buenas noches compañeros desde Barrio Castañares! 🇦🇷', 20),
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000006', 'Saludos desde Cafayate, seguimos la clase con los chicos del secundario.', 17),
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000007', 'Qué vigente sigue lo de la Comunidad Organizada. Excelente la explicación.', 12),
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Gracias a todos. Al terminar dejamos el material en la Biblioteca.', 8),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000005', '¡Presente la Juventud de Lanús Este! ✌️', 10),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000004', 'Muy buena la propuesta de las cooperativas de trabajo.', 7),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000002', 'El sábado seguimos en la UB, están todos invitados.', 3),
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000007', 'El litio tiene que quedar en manos de los argentinos.', 30),
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000006', 'Importante el tema del federalismo fiscal para el Norte.', 22)
) as m(stream_id, user_id, message, mins)
where not exists (
  select 1 from public.chat_messages c
  where c.stream_id = m.stream_id::uuid and c.user_id = m.user_id::uuid and c.message = m.message
);

-- ============================================================
-- 6. FOROS DE EJEMPLO
-- ============================================================
insert into public.forum_threads (id, category_id, author_id, title, provincia, instrumento_tipo, created_at)
select t.id::uuid, c.id, t.author::uuid, t.title, t.provincia, 'texto', now() - (t.days || ' days')::interval
from (values
  ('f0000000-0000-4000-8000-000000000001', 'filosofia-justicialista',  'd0000000-0000-4000-8000-000000000006', '¿Qué significa hoy la Comunidad Organizada?', 'Salta', 6),
  ('f0000000-0000-4000-8000-000000000002', 'principios-doctrinarios',  'd0000000-0000-4000-8000-000000000001', 'Las 20 Verdades: ¿cuál es la más vigente para vos?', 'Salta', 5),
  ('f0000000-0000-4000-8000-000000000003', 'justicia-social',          'd0000000-0000-4000-8000-000000000005', 'Trabajo y juventud en el conurbano sur', 'Buenos Aires', 4),
  ('f0000000-0000-4000-8000-000000000004', 'soberania-politica',       'd0000000-0000-4000-8000-000000000003', 'Litio y recursos estratégicos: una mirada desde el Norte', 'Salta', 3),
  ('f0000000-0000-4000-8000-000000000005', 'independencia-economica',  'd0000000-0000-4000-8000-000000000007', 'Producción local y pymes en Lanús', 'Buenos Aires', 2),
  ('f0000000-0000-4000-8000-000000000006', 'cultura',                  'd0000000-0000-4000-8000-000000000004', 'Folklore, peñas y militancia: la cultura como herramienta', 'Salta', 2),
  ('f0000000-0000-4000-8000-000000000007', 'principios-politicos',     'd0000000-0000-4000-8000-000000000002', 'La Unidad Básica como herramienta de organización', 'Buenos Aires', 1),
  ('f0000000-0000-4000-8000-000000000008', 'lineamientos-economicos',  'd0000000-0000-4000-8000-000000000007', 'Economía popular y justicia distributiva', null, 1)
) as t(id, slug, author, title, provincia, days)
join public.forum_categories c on c.slug = t.slug
on conflict (id) do nothing;

insert into public.forum_posts (thread_id, author_id, body, created_at)
select p.thread::uuid, p.author::uuid, p.body, now() - (p.hours || ' hours')::interval
from (values
  ('f0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000006', 'Abro el debate: una comunidad donde cada uno cumple una función y nadie se realiza en una comunidad que no se realiza. ¿Cómo lo aplicamos en nuestros barrios?', 140),
  ('f0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000004', 'Para mí empieza por las organizaciones libres del pueblo: el club, la cooperadora, la UB. Ahí se construye comunidad todos los días.', 120),
  ('f0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Coincido. En Castañares armamos una mesa barrial con la parroquia y el centro vecinal, y funciona.', 100),
  ('f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'Propongo que cada uno comparta la verdad que más lo interpela y por qué.', 110),
  ('f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000007', 'La que dice que para un peronista no puede haber nada mejor que otro peronista. La unidad por sobre todo.', 90),
  ('f0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000005', 'Para mí, la del trabajo como derecho y como deber. Es la base de todo lo demás.', 70),
  ('f0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000005', 'En Lanús tenemos muchos pibes sin primer empleo. ¿Qué experiencias de capacitación conocen que hayan funcionado?', 80),
  ('f0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000002', 'Desde la UB estamos armando talleres de oficios con el municipio. Los sumamos al próximo vivo.', 60),
  ('f0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000003', 'El Norte tiene que participar de las decisiones sobre sus recursos. Dejo el debate abierto para escuchar propuestas.', 60),
  ('f0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000006', 'Valor agregado en origen: que la industrialización quede en la provincia y genere empleo local.', 45),
  ('f0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000007', 'Las pymes metalúrgicas de Lanús son el corazón productivo del distrito. ¿Cómo las acompañamos?', 40),
  ('f0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000004', 'Estamos organizando una peña solidaria en Salta Capital. La cultura popular también es militancia.', 30),
  ('f0000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000002', 'La UB tiene que ser la puerta de entrada del vecino al Movimiento. Abierta, presente y organizada.', 20),
  ('f0000000-0000-4000-8000-000000000008', 'd0000000-0000-4000-8000-000000000007', 'La economía popular es una realidad de millones de compañeros. Hay que organizarla y darle derechos.', 10)
) as p(thread, author, body, hours)
where not exists (
  select 1 from public.forum_posts fp
  where fp.thread_id = p.thread::uuid and fp.body = p.body
);
