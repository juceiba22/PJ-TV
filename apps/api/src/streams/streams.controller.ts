import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import type { AuthedRequest } from '../auth/supabase-auth.guard';
import { MuxService } from '../mux/mux.service';
import { CreateStreamDto } from './dto/create-stream.dto';

@Controller('streams')
export class StreamsController {
  constructor(private readonly mux: MuxService) {}

  @UseGuards(SupabaseAuthGuard)
  @Post()
  async createStream(@Req() req: AuthedRequest, @Body() body: CreateStreamDto) {
    const supabase = req.supabase;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (profile?.role !== 'referente') {
      throw new ForbiddenException('Solo los Referentes pueden iniciar transmisiones.');
    }

    const { muxStreamId, streamKey, playbackId, rtmpUrl } =
      await this.mux.createLiveStream();

    const { data: stream, error } = await supabase
      .from('streams')
      .insert({
        referente_id: req.user.id,
        title: body.title,
        description: body.description ?? null,
        categoria: body.categoria ?? null,
        mux_stream_id: muxStreamId,
        mux_playback_id: playbackId,
        mux_stream_key: streamKey,
      })
      .select('id, mux_playback_id, status')
      .single();

    if (error || !stream) {
      throw new InternalServerErrorException(
        `No se pudo crear el stream: ${error?.message}`,
      );
    }

    return {
      streamId: stream.id,
      rtmpUrl,
      streamKey,
      playbackId: stream.mux_playback_id,
    };
  }
}
