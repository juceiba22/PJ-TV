-- Crear tabla de detalles de afiliado para mantener privacidad (ya que profiles es de lectura pública)
create table public.affiliate_details (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  nombre_completo text,
  dni text,
  numero_afiliado text,
  fecha_afiliacion date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.affiliate_details enable row level security;

create policy "affiliate_details_select_own" on public.affiliate_details
  for select using (auth.uid() = user_id);

create policy "affiliate_details_insert_own" on public.affiliate_details
  for insert with check (auth.uid() = user_id);

create policy "affiliate_details_update_own" on public.affiliate_details
  for update using (auth.uid() = user_id);
