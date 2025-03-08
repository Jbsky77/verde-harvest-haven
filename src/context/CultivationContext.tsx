
import { createContext, useContext } from 'react';
import { CultivationContextType } from './types';
import { CultivationProvider } from './providers/CultivationProvider';

export const CultivationContext = createContext<CultivationContextType | undefined>(undefined);

export const useCultivation = () => {
  const context = useContext(CultivationContext);
  if (context === undefined) {
    throw new Error('useCultivation must be used within a CultivationProvider');
  }
  return context;
};

export { CultivationProvider };
