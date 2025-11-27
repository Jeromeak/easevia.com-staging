import { createContext } from 'react';
import type { Currency } from '@/lib/types/api/currency';
import type { LanguageOption } from '../language-currency.types';

interface LanguageCurrencyContextType {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  currency: Currency | null;
  setCurrency: (currency: Currency) => void;
  currencies: Currency[];
  loading: boolean;
  error: string | null;
  triggerCurrencyFetch: () => Promise<void>;
}

export const LanguageCurrencyContext = createContext<LanguageCurrencyContextType | undefined>(undefined);
