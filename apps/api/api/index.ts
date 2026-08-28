import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createNestApp } from '../src/bootstrap';

// Cachea la app entre invocaciones "calientes" de la función serverless
// para no reconstruir Nest en cada request.
let cachedServer: express.Express | null = null;

async function getServer(): Promise<express.Express> {
  if (!cachedServer) {
    const expressInstance = express();
    const app = await createNestApp(expressInstance);
    await app.init();
    cachedServer = expressInstance;
  }
  return cachedServer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await getServer();
  server(req as unknown as express.Request, res as unknown as express.Response);
}
