'use client';

import { FC, ReactNode } from 'react';
import { StakefyProvider as StakefyPaymentProvider, StakefyX402Client } from 'x402-stakefy-react';

const client = new StakefyX402Client({
  apiUrl: 'https://stakefy-x402-production.up.railway.app',
  network: 'devnet',
});

export const StakefyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <StakefyPaymentProvider client={client}>
      {children}
    </StakefyPaymentProvider>
  );
};
