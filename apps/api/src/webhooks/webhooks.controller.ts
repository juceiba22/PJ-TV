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

    if (!data?.id) {
      this.logger.warn(`Evento de Mux ${event.type} recibido sin data.id`);
      return { received: true };
    }

    switch (event.type) {
      case 'video.live_stream.active': {
        const { error } = await supabase
          .from('streams')
          .update({ status: 'active', started_at: new Date().toISOString() })
          .eq('mux_stream_id', data.id);

        if (error) {
          this.logger.error(`Error actualizando stream a 'active': ${error.message}`);
        } else {
          this.logger.log(`Stream mux_id=${data.id} actualizado a 'active' exitosamente.`);
        }
        break;
      }

      case 'video.live_stream.idle': {
        const { error } = await supabase
          .from('streams')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
          .eq('mux_stream_id', data.id)
          .eq('status', 'active');

        if (error) {
          this.logger.error(`Error actualizando stream a 'ended': ${error.message}`);
        } else {
          this.logger.log(`Stream mux_id=${data.id} finalizado y actualizado a 'ended'.`);
        }
        break;
      }

      default:
        this.logger.debug(`Evento de Mux sin manejar: ${event.type}`);
    }

    return { received: true };
  }
}
