import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@pjtv/shared';

@Injectable()
export class SupabaseService {
  constructor(private readonly config: ConfigService) {}

  private get url() {
    return this.config.getOrThrow<string>('SUPABASE_URL');
  }

  /**
   * Cliente que actúa como el usuario dueño del token (respeta RLS).
   * Usa la anon key como apikey a propósito: si algún código se olvidara
   * de setear el token del usuario, cae a rol "anon" y no a "service_role".
   */
  forUser(accessToken: string): SupabaseClient<Database> {
    return createClient<Database>(
      this.url,
      this.config.getOrThrow<string>('SUPABASE_ANON_KEY'),
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
  }

  /** Cliente con privilegios de service role: ignora RLS. Solo para el webhook de Mux. */
  serviceRole(): SupabaseClient<Database> {
    return createClient<Database>(
      this.url,
      this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
}
