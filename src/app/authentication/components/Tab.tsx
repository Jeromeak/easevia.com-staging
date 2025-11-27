'use client';

import type { TabProps } from '@/lib/types/common.types';
import { TabType } from '@/lib/types/common.types';
import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';

export const Tab = ({ activeTab, onTabChange }: TabProps) => {
  const handleTabChange = useCallback(
    (tab: TabType) => {
      onTabChange(tab);
    },
    [onTabChange]
  );

  const tabs = useMemo(() => [TabType.EMAIL, TabType.MOBILE], []);

  return (
    <div className="flex justify-between w-full">
      {tabs.map((tab) => {
        const tabClass = clsx(
          'border-b-2 pb-4 cursor-pointer font-semibold text-lg leading-5 uppercase',
          activeTab === tab ? 'text-Teal-900 dark:text-Teal-500 border-b-Teal-500' : 'text-Light border-b-transparent'
        );

        return (
          <div key={tab} className="w-1/2 text-center">
            <div onClick={() => handleTabChange(tab)} className={tabClass}>
              {tab === TabType.EMAIL ? 'Email' : 'Mobile'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { TabType };
