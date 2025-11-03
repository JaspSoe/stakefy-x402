import type { RequestHandler } from 'express';
export type PriceSpec = { priceCents: number; memo?: string };
export const protect = (_spec: PriceSpec): RequestHandler => (_req, res, next) => next();
export const webhooks = (): RequestHandler => (_req, res) => res.status(200).json({ ok: true });
