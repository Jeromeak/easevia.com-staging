'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrencies } from '@/lib/api/currency';
import type { Currency } from '@/lib/types/api/currency';
import { getAccessToken } from '@/utils/tokenStorage';
import { LANGUAGE_OPTIONS, DEFAULT_LANGUAGE, type LanguageOption } from './language-currency.types';
import { LanguageCurrencyContext } from './contexts/LanguageCurrencyContext';
import { DEFAULT_USD_CURRENCY } from '@/lib/enums/constants';

const getStoredLanguage = (): LanguageOption => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const stored = localStorage.getItem('selectedLanguage');

    if (stored) {
      const parsed = JSON.parse(stored);

      return LANGUAGE_OPTIONS.find((opt) => opt.value === parsed.value) || DEFAULT_LANGUAGE;
    }
  } catch (error) {
    console.error('Error reading stored language:', error);
  }

  return DEFAULT_LANGUAGE;
};

const getStoredCurrency = (): Currency | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('selectedCurrency');

    if (stored && stored !== 'undefined') {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading stored currency:', error);
  }

  return null;
};

const setStoredLanguage = (language: LanguageOption) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('selectedLanguage', JSON.stringify({ value: language.value, label: language.label }));
  } catch (error) {
    console.error('Error storing language:', error);
  }
};

const setStoredCurrency = (currency: Currency) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
  } catch (error) {
    console.error('Error storing currency:', error);
  }
};

const clearStoredCurrency = () => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('selectedCurrency');
  } catch (error) {
    console.error('Error clearing currency:', error);
  }
};

export const LanguageCurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageOption>(getStoredLanguage);
  const [currency, setCurrencyState] = useState<Currency | null>(getStoredCurrency);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setLanguage = useCallback((lang: LanguageOption) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  }, []);

  const setCurrency = useCallback((curr: Currency) => {
    setCurrencyState(curr);
    setStoredCurrency(curr);
  }, []);

  const triggerCurrencyFetch = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchCurrencies();
      setCurrencies(data);

      const usd = data.find(
        (c) => c.currency_name === 'US Dollar' || c.currency_symbol === 'USD' || c.currency_symbol === '$'
      );

      if (usd) {
        setCurrency(usd);
      } else if (data.length > 0) {
        setCurrency(data[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch currencies';
      console.error('Error fetching currencies:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Disable automatic currency fetching - only allow manual triggering via triggerCurrencyFetch()
  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      clearStoredCurrency();
      setCurrencyState(DEFAULT_USD_CURRENCY);
    }
  }, []);

  return (
    <LanguageCurrencyContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        currencies,
        loading,
        error,
        triggerCurrencyFetch,
      }}
    >
      {children}
    </LanguageCurrencyContext.Provider>
  );
};
