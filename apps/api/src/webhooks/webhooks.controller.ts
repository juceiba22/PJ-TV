import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Req,
  type RawBodyRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import { MuxService } from '../mux/mux.service';
import { SupabaseService } from '../supabase/supabase.service';

interface LiveStreamEventData {
  id: string;
}

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly mux: MuxService,
    private readonly supabase: SupabaseService,
  ) {}

  @Post('mux')
  async handleMuxWebhook(@Req() req: RawBodyRequest<Request>) {
    if (!req.rawBody) {
      throw new BadRequestException('Falta el body crudo de la request.');
    }

    const event = await this.mux.unwrapWebhookEvent(
      req.rawBody,
      req.headers as Record<string, string>,
    );

    const data = event.data as LiveStreamEventData;
    const supabase = this.supabase.serviceRole();

    switch (event.type) {
      case 'video.live_stream.active':
        await supabase
          .from('streams')
          .update({ status: 'active', started_at: new Date().toISOString() })
          .eq('mux_stream_id', data.id);
        break;

      case 'video.live_stream.idle':
        await supabase
          .from('streams')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
          .eq('mux_stream_id', data.id)
          .eq('status', 'active');
        break;

      default:
        this.logger.debug(`Evento de Mux sin manejar: ${event.type}`);
    }

    return { received: true };
  }
}
