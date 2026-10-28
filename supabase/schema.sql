create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  relationship text not null,
  generation integer not null,
  family_side text not null check (family_side in ('paternal', 'maternal', 'self', 'unknown')),
  blood_relative boolean not null default true,
  gender text,
  birth_year integer,
  living_status text check (living_status in ('living', 'deceased')),
  created_at timestamptz not null default now()
);

create table if not exists public.medical_conditions (
  id uuid primary key default gen_random_uuid(),
  family_member_id uuid not null references public.family_members(id) on delete cascade,
  condition_name text not null,
  diagnosis_age integer check (diagnosis_age between 0 and 130),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.medical_conditions enable row level security;

create index if not exists family_members_family_id_idx
  on public.family_members(family_id);

create index if not exists medical_conditions_member_id_idx
  on public.medical_conditions(family_member_id);
