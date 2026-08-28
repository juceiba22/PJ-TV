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
  playback_ids?: Array<{ id: string; policy: string }>;
  status?: string;
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
      this.logger.error('[Mux Webhook] Rechazado: Falta el body crudo (rawBody) en la petición.');
      throw new BadRequestException('Falta el body crudo de la request.');
    }

    let event;
    try {
      event = await this.mux.unwrapWebhookEvent(
        req.rawBody,
        req.headers as Record<string, string>,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`[Mux Webhook] Error al verificar firma o parsear webhook: ${msg}`);
      throw new BadRequestException(`Firma de webhook inválida: ${msg}`);
    }

    const data = event.data as LiveStreamEventData;
    const eventType = event.type;
    const muxStreamId = data?.id;

    this.logger.log(`[Mux Webhook] 📥 Evento recibido: "${eventType}" | Mux Stream ID: "${muxStreamId}"`);

    if (!muxStreamId) {
      this.logger.warn(`[Mux Webhook] Evento ${eventType} ignorado: no contiene data.id`);
      return { received: true };
    }

    const supabase = this.supabase.serviceRole();

    switch (eventType) {
      case 'video.live_stream.active': {
        const now = new Date().toISOString();
        const { data: updated, error } = await supabase
          .from('streams')
          .update({ status: 'active', started_at: now })
          .eq('mux_stream_id', muxStreamId)
          .select('id, title, status, referente_id');

        if (error) {
          this.logger.error(`[Mux Webhook] ❌ Error actualizando stream en Supabase: ${error.message}`);
        } else if (!updated || updated.length === 0) {
          this.logger.warn(
            `[Mux Webhook] ⚠️ No se encontró ningún stream con mux_stream_id="${muxStreamId}". Verifica si se registró correctamente al crear el stream.`,
          );
        } else {
          this.logger.log(
            `[Mux Webhook] 🟢 Stream activado con éxito: "${updated[0].title}" (ID: ${updated[0].id}, Referente: ${updated[0].referente_id})`,
          );
        }
        break;
      }

      case 'video.live_stream.idle': {
        const now = new Date().toISOString();
        const { data: updated, error } = await supabase
          .from('streams')
          .update({ status: 'ended', ended_at: now })
          .eq('mux_stream_id', muxStreamId)
          .eq('status', 'active')
          .select('id, title, status');

        if (error) {
          this.logger.error(`[Mux Webhook] ❌ Error finalizando stream en Supabase: ${error.message}`);
        } else if (!updated || updated.length === 0) {
          this.logger.log(
            `[Mux Webhook] ℹ️ Evento idle recibido para mux_stream_id="${muxStreamId}", pero el stream no estaba marcado como 'active' en BD.`,
          );
        } else {
          this.logger.log(
            `[Mux Webhook] 🔴 Stream finalizado y marcado como 'ended': "${updated[0].title}" (ID: ${updated[0].id})`,
          );
        }
        break;
      }

      default:
        this.logger.debug(`[Mux Webhook] Evento no procesado específicamente: ${eventType}`);
    }

    return { received: true };
  }
}
