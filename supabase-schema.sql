-- ============================================================
--  EquipaTech — Schema Supabase
--  Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Tabela de produtos
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text not null default '',
  category     text not null default 'Outros',
  image_url    text not null default '',
  available    boolean not null default true,
  specs        jsonb not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2. Trigger para atualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- 3. Row Level Security
alter table public.products enable row level security;

-- Leitura pública (catálogo para todos os funcionários)
create policy "Leitura pública de produtos"
  on public.products for select
  using (true);

-- Escrita apenas para usuários autenticados (admin)
create policy "Admin pode inserir produtos"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Admin pode atualizar produtos"
  on public.products for update
  to authenticated
  using (true);

create policy "Admin pode excluir produtos"
  on public.products for delete
  to authenticated
  using (true);

-- 4. Dados iniciais de exemplo
insert into public.products (name, description, category, image_url, available, specs) values
(
  'Headset HyperX Cloud II',
  'Headset gamer com som surround 7.1, almofadas de espuma viscoelástica e microfone removível com cancelamento de ruído.',
  'Headsets',
  'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&q=80',
  true,
  '{"Conexão":"USB / 3.5mm","Driver":"53mm","Resposta de freq.":"15Hz–25kHz"}'
),
(
  'Mouse Logitech MX Master 3',
  'Mouse ergonômico de alta performance com scroll MagSpeed, rastreamento em qualquer superfície e botões programáveis.',
  'Mouses',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
  true,
  '{"Conexão":"Bluetooth / USB","DPI":"até 4000","Bateria":"70 dias"}'
),
(
  'Mousepad Redragon P001 XXL',
  'Mousepad de tecido premium extra grande com base antiderrapante e bordas costuradas para maior durabilidade.',
  'Mousepads',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
  true,
  '{"Dimensões":"900 × 400mm","Espessura":"3mm","Material":"Tecido premium"}'
),
(
  'Monitor LG 27" 4K IPS',
  'Monitor UltraFine 4K com painel IPS, HDR400, cobertura sRGB 99% e saída USB-C com carregamento 96W.',
  'Monitores',
  'https://images.unsplash.com/photo-1527443224154-c4a573d5e27f?w=400&q=80',
  true,
  '{"Resolução":"3840×2160","Painel":"IPS","Refresh":"60Hz","HDR":"HDR400"}'
),
(
  'Hub USB-C Anker 7-em-1',
  'Hub compacto com HDMI 4K, 3× USB-A, USB-C dados, SD e microSD. Ideal para notebooks com poucas portas.',
  'Hubs USB',
  'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&q=80',
  true,
  '{"Portas":"7","HDMI":"4K@30Hz","USB-A":"3× USB 3.0","Cartões":"SD + microSD"}'
),
(
  'Teclado Keychron K2 Wireless',
  'Teclado mecânico compacto 75% com switches ópticos, retroiluminação RGB e compatibilidade Mac/Windows.',
  'Teclados',
  'https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=400&q=80',
  true,
  '{"Layout":"75% (84 teclas)","Conexão":"Bluetooth / USB-C","Bateria":"4000mAh"}'
),
(
  'Webcam Logitech C920 HD Pro',
  'Webcam Full HD 1080p com autofoco, som estéreo e campo de visão 78° para videoconferências nítidas.',
  'Webcams',
  'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&q=80',
  false,
  '{"Resolução":"1080p/30fps","Campo visão":"78°","Microfone":"Estéreo embutido"}'
),
(
  'Monitor Dell 24" Full HD',
  'Monitor profissional com painel IPS slim bezel, ajuste de altura, pivô e saídas HDMI/DisplayPort.',
  'Monitores',
  'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&q=80',
  true,
  '{"Resolução":"1920×1080","Painel":"IPS","Refresh":"75Hz","Conexões":"HDMI + DP"}'
);
