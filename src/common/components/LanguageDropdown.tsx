'use client';

import { Fragment, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Option } from '@/lib/types/common.types';
import CustomDropdown from '@/common/components/Select';
import { ArrowDown } from '@/icons/icon';
import { useLanguageCurrency } from '@/context/hooks/useLanguageCurrency';
import { LANGUAGE_OPTIONS } from '@/context/language-currency.types';
import type { Currency } from '@/lib/types/api/currency';
import clsx from 'clsx';

export const LanguageCurrencySelector = () => {
  const { language, setLanguage, currency, setCurrency, currencies, loading, error, triggerCurrencyFetch } =
    useLanguageCurrency();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  type CurrencyOption = { value: string; label: string; currency: Currency };
  const currencyOptions: CurrencyOption[] = useMemo(
    () =>
      currencies.map((c) => ({
        value: c.currency_symbol,
        label: `${c.currency_symbol} - ${c.currency_name}`,
        currency: c,
      })),
    [currencies]
  );

  const selectedCurrencyOption = useMemo(
    () =>
      currency && currencyOptions.length > 0
        ? currencyOptions.find((opt) => opt.currency.currency_symbol === currency.currency_symbol) || currencyOptions[0]
        : undefined,
    [currency, currencyOptions]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;

    if (
      (desktopRef.current && desktopRef.current.contains(target)) ||
      (mobileRef.current && mobileRef.current.contains(target))
    ) {
      return;
    }

    setIsOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleToggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;

      // Lazy-load currencies when opening for the first time
      if (next && !loading && currencies.length === 0) {
        void triggerCurrencyFetch();
      }

      return next;
    });
  }, [currencies.length, loading, triggerCurrencyFetch]);

  const handleLanguageChange = useCallback(
    (opt: Option) => {
      const languageOption = LANGUAGE_OPTIONS.find((lang) => lang.value === opt.value);

      if (languageOption) {
        setLanguage(languageOption);
      }
    },
    [setLanguage]
  );

  const handleCurrencyChange = useCallback(
    (val: Option) => {
      setCurrency((val as CurrencyOption).currency);
    },
    [setCurrency]
  );

  return (
    <Fragment>
      <div ref={desktopRef} className="relative hidden lg:inline-block w-[10rem] text-left">
        <button
          onClick={handleToggleDropdown}
          className="flex items-center gap-2 px-4 py-3 cursor-pointer rounded-md dark:text-white"
        >
          <span>
            <language.icon className="w-5 h-5" />
          </span>
          <span className="uppercase">
            {!hasMounted || loading || !currency ? (
              <span className="animate-pulse">...</span>
            ) : (
              `${language.value}-${currency.currency_symbol}`
            )}
          </span>
          <span className="ml-1">
            <ArrowDown />
          </span>
        </button>
        <div
          className={clsx(
            'lg:absolute z-50 w-64 bg-white dark:bg-gray-300 shadow-12xl rounded-md mt-2 p-4 transition-all duration-300 ease-in-out transform origin-top',
            {
              'lg:scale-y-100 opacity-100 max-h-[20rem]': isOpen,
              'lg:scale-y-0 max-h-0 opacity-0 pointer-events-none': !isOpen,
            }
          )}
        >
          <div className="mb-4">
            <CustomDropdown
              options={LANGUAGE_OPTIONS.map((lang) => ({
                value: lang.value,
                label: lang.label,
                icon: <lang.icon className="w-5 h-5" />,
              }))}
              value={{
                value: language.value,
                label: language.label,
                icon: <language.icon className="w-5 h-5" />,
              }}
              onChange={handleLanguageChange}
              className="!bg-blue-150 dark:!bg-gray-420 !text-base !rounded-[4px] !text-neutral-50 dark:!text-[#4D4D51] !border-blue-150 dark:!border-[#343434]"
              placeholder="Language"
              bgColor="bg-white dark:bg-gray-300"
              labelColor="bg-blue-150 dark:bg-gray-420"
            />
          </div>
          <div>
            {loading ? (
              <div className="text-center py-2">Loading currencies...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-2">{error}</div>
            ) : (
              <CustomDropdown
                options={currencyOptions}
                value={selectedCurrencyOption}
                onChange={handleCurrencyChange}
                className="!bg-blue-150 dark:!bg-gray-420 !text-base !rounded-[4px] !text-neutral-50 dark:!text-[#4D4D51] !border-blue-150 dark:!border-[#343434]"
                placeholder="Currency"
                bgColor="bg-white dark:bg-gray-300"
                labelColor="bg-blue-150 dark:bg-gray-420"
              />
            )}
          </div>
        </div>
      </div>
      <div ref={mobileRef} className="w-full lg:hidden">
        <button
          onClick={handleToggleDropdown}
          className="flex items-center relative border-b border-b-blue-150 dark:border-b-white/30 gap-2 w-full cursor-pointer pb-3 dark:text-white"
        >
          <span>
            <language.icon className="w-5 h-5" />
          </span>
          <span className="uppercase text-xl">
            {!hasMounted || loading || !currency ? (
              <span className="animate-pulse">...</span>
            ) : (
              `${language.value}-${currency.currency_symbol}`
            )}
          </span>
          <span className="ml-1 absolute right-0 ">
            <ArrowDown
              className={clsx('transform text-white transition-transform duration-300', {
                'rotate-180': isOpen,
              })}
            />
          </span>
        </button>
        <div
          className={clsx(
            'lg:absolute z-50 w-full transition-all bg-white dark:bg-gray-300 shadow-12xl rounded-md mt-2 p-4 duration-300 ease-in-out transform origin-top',
            {
              'lg:scale-y-100 opacity-100 max-h-[20rem]': isOpen,
              'lg:scale-y-0 max-h-0 opacity-0 pointer-events-none': !isOpen,
            }
          )}
        >
          <div className="py-4">
            <CustomDropdown
              options={LANGUAGE_OPTIONS.map((lang) => ({
                value: lang.value,
                label: lang.label,
                icon: <lang.icon className="w-5 h-5" />,
              }))}
              value={{
                value: language.value,
                label: language.label,
                icon: <language.icon className="w-5 h-5" />,
              }}
              onChange={handleLanguageChange}
              className="!text-base !rounded-[4px] !text-neutral-50 dark:!text-[#4D4D51] !border-blue-150 dark:!border-[#343434] !bg-blue-150 dark:!bg-gray-420"
              placeholder="Language"
              bgColor="bg-white dark:bg-gray-300"
              labelColor="bg-blue-150 dark:bg-gray-420"
            />
          </div>
          <div>
            {loading ? (
              <div className="text-center py-2">Loading currencies...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-2">{error}</div>
            ) : (
              <CustomDropdown
                options={currencyOptions}
                value={selectedCurrencyOption}
                onChange={handleCurrencyChange}
                className="!bg-blue-150 dark:!bg-gray-420 !text-base !rounded-[4px] !text-neutral-50 dark:!text-[#4D4D51] !border-blue-150 dark:!border-[#343434]"
                placeholder="Currency"
                bgColor="bg-white dark:bg-gray-300"
                labelColor="bg-blue-150 dark:bg-gray-420"
              />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
