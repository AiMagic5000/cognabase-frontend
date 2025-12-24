'use client';

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Project = {
  id: string;
  user_id: string;
  project_name: string;
  service_uuid: string | null;
  status: 'creating' | 'ready' | 'failed';
  step: string;
  studio_url: string | null;
  admin_username: string | null;
  admin_password: string | null;
  postgres_password: string | null;
  jwt_secret: string | null;
  anon_key: string | null;
  service_key: string | null;
  created_at: string;
  updated_at: string;
};
