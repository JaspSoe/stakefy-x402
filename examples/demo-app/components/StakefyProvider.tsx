'use client';

import { FC, ReactNode } from 'react';

// Temporary provider wrapper until package export is fixed
export const StakefyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
