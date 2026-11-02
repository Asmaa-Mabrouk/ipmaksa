-- Run once in the Supabase SQL editor.
create table if not exists public.documents (
  collection  text        not null,
  id          text        not null,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (collection, id)
);

-- The site talks to this table only from the server with the service-role key.
-- Row Level Security is enabled with no public policies, so the anon key can never read members members.
alter table public.documents enable row level security;

-- Public bucket for uploaded images (read-only for the public; uploads go through the server).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
