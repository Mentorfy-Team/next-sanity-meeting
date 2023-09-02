import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/@types/supabase/v2.types';

import { createClient } from '@supabase/supabase-js';

export const SupabaseAdmin = (req?) => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE,
    {
      auth: {
        persistSession: false,
      },
    },
  );
};

export const SupabaseAuthAdmin = (req?) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE,
    {
      db: {
        schema: 'auth',
      },
      auth: {
        persistSession: false,
      },
    },
  );
};

