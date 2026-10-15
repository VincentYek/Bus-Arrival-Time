/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Request, Response } from 'express';

/**
 * Serverless LTA DataMall v3 Bus Arrival Handler
 * Endpoint: GET /api/busarrival?BusStopCode=83139
 *
 * Proxies requests to:
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=...
 * Headers:
 *   AccountKey: <LTA_ACCOUNT_KEY>
 *   accept: application/json
 */
export default async function handler(req: Request, res: Response) {
  // Read BusStopCode from query parameters (defaults to 83139 if omitted)
  const rawCode = (req.query.BusStopCode || req.query.busStopCode || '83139') as string;
  const busStopCode = rawCode?.trim();

  // Read optional ServiceNo (e.g. 15, 33, 65)
  const rawService = (req.query.ServiceNo || req.query.serviceNo) as string | undefined;
  const serviceNo = rawService?.trim();

  if (!busStopCode) {
    return res.status(400).json({
      error: 'BusStopCode parameter is required. Example: /api/busarrival?BusStopCode=83139'
    });
  }

  // Strictly retrieve AccountKey from environment or dynamic request header.
  // NO hardcoded keys.
  const envKey = (process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY !== 'MY_LTA_ACCOUNT_KEY')
    ? process.env.LTA_ACCOUNT_KEY
    : undefined;

  const headerKey = req.headers['x-account-key'] as string | undefined;
  const accountKey = envKey || headerKey;

  const targetLtaUrl = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
  targetLtaUrl.searchParams.set('BusStopCode', busStopCode);
  if (serviceNo) {
    targetLtaUrl.searchParams.set('ServiceNo', serviceNo);
  }

  if (!accountKey) {
    return res.status(401).json({
      error: 'LTA_ACCOUNT_KEY is missing. Please set LTA_ACCOUNT_KEY in your environment (.env) or pass x-account-key header.',
      targetEndpoint: targetLtaUrl.toString(),
      configured: false
    });
  }

  try {
    const response = await fetch(targetLtaUrl.toString(), {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall API responded with HTTP ${response.status}`,
        details: errorText,
        status: response.status,
        targetEndpoint: targetLtaUrl.toString()
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      live: true,
      source: 'LTA DataMall v3',
      endpoint: targetLtaUrl.toString(),
      data
    });
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to connect to LTA DataMall serverless endpoint',
      details: error?.message || String(error),
      targetEndpoint: targetLtaUrl.toString()
    });
  }
}
