import { useContext } from 'react';
import { LanguageCurrencyContext } from '../contexts/LanguageCurrencyContext';

export const useLanguageCurrency = () => {
  const ctx = useContext(LanguageCurrencyContext);

  if (!ctx) throw new Error('useLanguageCurrency must be used within LanguageCurrencyProvider');

  return ctx;
};
