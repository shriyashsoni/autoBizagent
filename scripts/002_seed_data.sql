-- Insert sample integrations
insert into public.integrations (name, type, status, config) values
  ('Gmail', 'email', 'connected', '{"api_key": "demo_key"}'::jsonb),
  ('HubSpot', 'crm', 'connected', '{"api_key": "demo_key"}'::jsonb),
  ('Google Calendar', 'calendar', 'connected', '{"api_key": "demo_key"}'::jsonb),
  ('Notion', 'notes', 'connected', '{"api_key": "demo_key"}'::jsonb),
  ('Slack', 'messaging', 'connected', '{"webhook_url": "demo_url"}'::jsonb)
on conflict (name) do nothing;

-- Insert sample leads
insert into public.leads (email, name, company, phone, source, status, priority, notes) values
  ('john.doe@techcorp.com', 'John Doe', 'TechCorp Inc', '+1-555-0123', 'email', 'contacted', 'high', 'Interested in enterprise plan'),
  ('sarah.smith@startup.io', 'Sarah Smith', 'Startup.io', '+1-555-0124', 'email', 'new', 'high', 'Looking for automation solutions'),
  ('mike.johnson@bizco.com', 'Mike Johnson', 'BizCo', '+1-555-0125', 'email', 'qualified', 'medium', 'Requested demo'),
  ('emily.brown@agency.com', 'Emily Brown', 'Creative Agency', '+1-555-0126', 'manual', 'contacted', 'low', 'General inquiry')
on conflict do nothing;
