/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // LTA DataMall Status Check
  app.get('/api/lta/status', (req: Request, res: Response) => {
    const hasEnvKey = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY !== 'MY_LTA_ACCOUNT_KEY');
    res.json({
      configured: hasEnvKey,
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      sampleStopCode: '83139',
      message: hasEnvKey
        ? 'LTA_ACCOUNT_KEY is active in environment.'
        : 'LTA_ACCOUNT_KEY not set in environment. Set it in .env or pass x-account-key header.'
    });
  });

  // LTA DataMall v3 Bus Arrival Proxy Endpoint
  // GET /api/lta/bus-arrival?BusStopCode=83139&ServiceNo=15
  app.get('/api/lta/bus-arrival', async (req: Request, res: Response) => {
    const busStopCode = (req.query.BusStopCode as string)?.trim();
    const serviceNo = (req.query.ServiceNo as string)?.trim();

    if (!busStopCode) {
      return res.status(400).json({
        error: 'BusStopCode query parameter is required. Example: ?BusStopCode=83139'
      });
    }

    // Support both server environment key and client provided key via header
    const headerKey = req.headers['x-account-key'] as string | undefined;
    const envKey = process.env.LTA_ACCOUNT_KEY !== 'MY_LTA_ACCOUNT_KEY' ? process.env.LTA_ACCOUNT_KEY : undefined;
    const accountKey = headerKey || envKey;

    if (!accountKey) {
      return res.status(401).json({
        live: false,
        needsKey: true,
        error: 'LTA_ACCOUNT_KEY is missing. Please set LTA_ACCOUNT_KEY in .env or provide AccountKey in app Settings.',
        endpointUsed: `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`
      });
    }

    try {
      const ltaUrl = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
      ltaUrl.searchParams.set('BusStopCode', busStopCode);
      if (serviceNo) {
        ltaUrl.searchParams.set('ServiceNo', serviceNo);
      }

      console.log(`[LTA Datamall] Requesting: ${ltaUrl.toString()} with AccountKey: ${accountKey.substring(0, 4)}***`);

      const response = await fetch(ltaUrl.toString(), {
        method: 'GET',
        headers: {
          'AccountKey': accountKey,
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[LTA Datamall Error] ${response.status}: ${errorText}`);
        return res.status(response.status).json({
          live: false,
          error: `LTA DataMall API responded with HTTP ${response.status}`,
          details: errorText,
          status: response.status
        });
      }

      const ltaData = await response.json();
      return res.json({
        live: true,
        source: 'lta-datamall-v3',
        endpoint: ltaUrl.toString(),
        timestamp: Date.now(),
        data: ltaData
      });
    } catch (err: any) {
      console.error('[LTA Datamall Exception]', err);
      return res.status(502).json({
        live: false,
        error: 'Failed to connect to LTA DataMall endpoint',
        details: err?.message || String(err)
      });
    }
  });

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
