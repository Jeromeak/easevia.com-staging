import { createContext } from 'react';
import type { CheckoutContextType } from '../checkout.types';

export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);
