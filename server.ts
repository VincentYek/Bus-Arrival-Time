import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthHandler from './api/health';
import busArrivalHandler from './api/busarrival';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Mount serverless endpoints from /api folder (root level)
  app.get('/api/health', healthHandler);
  app.get('/api/busarrival', busArrivalHandler);

  // Backward-compatible alias routes
  app.get('/api/lta/status', healthHandler);
  app.get('/api/lta/bus-arrival', busArrivalHandler);

  // Development: Vite middleware for HMR and React SPA
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SG BusPulse Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
