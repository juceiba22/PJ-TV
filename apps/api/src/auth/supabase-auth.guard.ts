import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@pjtv/shared';
import { SupabaseService } from '../supabase/supabase.service';

export interface AuthedRequest extends Request {
  user: User;
  accessToken: string;
  supabase: SupabaseClient<Database>;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta el token de sesión.');
    }

    const accessToken = authHeader.slice('Bearer '.length);
    const client = this.supabase.forUser(accessToken);
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error || !user) {
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }

    request.user = user;
    request.accessToken = accessToken;
    request.supabase = client;
    return true;
  }
}
