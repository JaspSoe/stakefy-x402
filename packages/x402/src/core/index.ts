export type BuyerOptions = { facilitator: string };
export type Buyer = { facilitator: string };
export function createBuyer(opts: BuyerOptions): Buyer { return { facilitator: opts.facilitator }; }
export async function fetch402(url: string): Promise<Response> { return fetch(url); }
