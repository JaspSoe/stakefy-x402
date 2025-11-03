import { StakefyX402Client } from './client';

/**
 * Pay to X/Twitter username - Stakefy's killer feature
 * 
 * @example
 * await payToX(client, '@elonmusk', 0.25)
 */
export async function payToX(
  client: StakefyX402Client,
  username: string,
  amount: number,
  reference?: string
) {
  // Ensure username starts with @
  const formattedUsername = username.startsWith('@') ? username.slice(1) : username;
  
  return client.payToUsername({
    username: formattedUsername,
    amount,
    reference: reference || `x-payment-${Date.now()}`,
  });
}
