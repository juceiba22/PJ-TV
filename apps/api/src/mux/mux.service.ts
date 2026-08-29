import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mux from '@mux/mux-node';

@Injectable()
export class MuxService {
  private readonly client: Mux;

  constructor(private readonly config: ConfigService) {
    this.client = new Mux({
      tokenId: this.config.getOrThrow<string>('MUX_TOKEN_ID'),
      tokenSecret: this.config.getOrThrow<string>('MUX_TOKEN_SECRET'),
    });
  }

  async createLiveStream() {
    const liveStream = await this.client.video.liveStreams.create({
      playback_policies: ['public'],
      latency_mode: 'reduced',
      reconnect_window: 30,
      test: this.config.get<string>('MUX_TEST_STREAMS') === 'true',
    });

    return {
      muxStreamId: liveStream.id!,
      streamKey: liveStream.stream_key!,
      playbackId: liveStream.playback_ids?.[0]?.id ?? null,
      rtmpUrl: 'rtmp://global-live.mux.com/app',
    };
  }

  async completeLiveStream(muxStreamId: string) {
    try {
      await this.client.video.liveStreams.complete(muxStreamId);
    } catch (e) {
      // Ignorar si ya estaba inactivo
    }
  }

  unwrapWebhookEvent(rawBody: Buffer, headers: Record<string, unknown>) {
    return this.client.webhooks.unwrap(
      rawBody.toString('utf8'),
      headers as Record<string, string>,
      this.config.getOrThrow<string>('MUX_WEBHOOK_SECRET'),
    );
  }
}
