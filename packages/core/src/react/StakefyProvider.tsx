import React, { createContext, useContext } from 'react';
import { StakefyX402Client } from '../client';
import type { StakefyConfig } from '../types';

const StakefyContext = createContext<StakefyX402Client | null>(null);

export function StakefyProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: StakefyConfig;
}) {
  const client = new StakefyX402Client(config);

  return (
    <StakefyContext.Provider value={client}>
      {children}
    </StakefyContext.Provider>
  );
}

export function useStakefyClient() {
  const client = useContext(StakefyContext);
  if (!client) {
    throw new Error('useStakefyClient must be used within StakefyProvider');
  }
  return client;
}
