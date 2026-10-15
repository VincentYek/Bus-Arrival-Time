/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Request, Response } from 'express';

/**
 * Serverless Health Check Handler
 * Endpoint: GET /api/health
 */
export default async function handler(req: Request, res: Response) {
  const isKeyConfigured = Boolean(
    process.env.LTA_ACCOUNT_KEY &&
    process.env.LTA_ACCOUNT_KEY !== 'MY_LTA_ACCOUNT_KEY'
  );

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ltaKeyConfigured: isKeyConfigured,
    service: 'LTA DataMall Serverless Connection',
    endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    sampleStopCode: '83139'
  });
}
