import React, { createContext, useContext, ReactNode } from 'react';
import { StakefyX402Client } from 'x402-stakefy-sdk';

interface StakefyContextValue {
  client: StakefyX402Client;
}

const StakefyContext = createContext<StakefyContextValue | null>(null);

export interface StakefyProviderProps {
  client: StakefyX402Client;
  children: ReactNode;
}

export function StakefyProvider({ client, children }: StakefyProviderProps) {
  return (
    <StakefyContext.Provider value={{ client }}>
      {children}
    </StakefyContext.Provider>
  );
}

export function useStakefyClient(): StakefyX402Client {
  const context = useContext(StakefyContext);
  
  if (!context) {
    throw new Error('useStakefyClient must be used within a StakefyProvider');
  }
  
  return context.client;
}
