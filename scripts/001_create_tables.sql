-- Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  company text,
  phone text,
  source text not null default 'manual',
  status text not null default 'new',
  priority text not null default 'medium',
  notes text,
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create workflows table
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  status text not null default 'pending',
  current_step integer default 0,
  total_steps integer default 5,
  steps jsonb not null default '[]'::jsonb,
  error_message text,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create activities table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete cascade,
  type text not null,
  description text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Create integrations table
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null,
  status text not null default 'disconnected',
  config jsonb,
  last_synced_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.leads enable row level security;
alter table public.workflows enable row level security;
alter table public.activities enable row level security;
alter table public.integrations enable row level security;

-- Create policies for public access (adjust based on your auth requirements)
-- For now, allowing all operations for simplicity
create policy "Allow all operations on leads" on public.leads for all using (true) with check (true);
create policy "Allow all operations on workflows" on public.workflows for all using (true) with check (true);
create policy "Allow all operations on activities" on public.activities for all using (true) with check (true);
create policy "Allow all operations on integrations" on public.integrations for all using (true) with check (true);

-- Create indexes for better performance
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_workflows_lead_id on public.workflows(lead_id);
create index if not exists idx_workflows_status on public.workflows(status);
create index if not exists idx_activities_lead_id on public.activities(lead_id);
create index if not exists idx_activities_created_at on public.activities(created_at desc);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for updated_at
drop trigger if exists set_updated_at_leads on public.leads;
create trigger set_updated_at_leads
  before update on public.leads
  for each row
  execute function public.handle_updated_at();

drop trigger if exists set_updated_at_workflows on public.workflows;
create trigger set_updated_at_workflows
  before update on public.workflows
  for each row
  execute function public.handle_updated_at();

drop trigger if exists set_updated_at_integrations on public.integrations;
create trigger set_updated_at_integrations
  before update on public.integrations
  for each row
  execute function public.handle_updated_at();
