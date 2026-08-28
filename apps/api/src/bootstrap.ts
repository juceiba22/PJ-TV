import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import type express from 'express';
import { AppModule } from './app.module';

/**
 * Bootstrap compartido por dos entrypoints:
 * - src/main.ts: servidor persistente (dev local, Render/Railway).
 * - api/index.ts: handler serverless de Vercel (recibe una instancia de Express propia).
 */
export async function createNestApp(
  expressInstance?: express.Express,
): Promise<NestExpressApplication> {
  const app = expressInstance
    ? await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(expressInstance),
        { rawBody: true },
      )
    : await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  app.enableCors({ origin: process.env.WEB_APP_ORIGIN ?? 'http://localhost:3000' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  return app;
}
