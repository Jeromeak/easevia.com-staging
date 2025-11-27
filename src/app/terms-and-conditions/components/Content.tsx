'use client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { Agreement } from './Agreement';
import { Modification } from './Modification';
import { EntireAgreement } from './EntireAgreement';
import clsx from 'clsx';

export const Content = () => {
  const initialTabs = useMemo(
    () => [
      { id: 0, title: 'Agreement', content: <Agreement /> },
      { id: 1, title: 'Modification of terms', content: <Modification /> },
      { id: 2, title: 'Entire agreement', content: <EntireAgreement /> },
    ],
    []
  );

  const [activeId, setActiveId] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback((id: number) => {
    setActiveId(id);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, [activeId]);

  const tabClickHandlers = useMemo(() => {
    const handlers: Record<number, () => void> = {};
    initialTabs.forEach((tab) => {
      handlers[tab.id] = () => handleTabClick(tab.id);
    });

    return handlers;
  }, [handleTabClick, initialTabs]);

  const tabClassNames = useMemo(() => {
    return initialTabs.reduce(
      (acc, tab) => {
        acc[tab.id] = clsx(
          'uppercase text-lg md:text-xl cursor-pointer border-b w-fit pb-2 duration-500 ease-in-out tracking-[0.96px] transition-colors',
          activeId === tab.id
            ? 'text-Teal-500 dark:text-orange-200 dark:border-b-orange-200'
            : 'text-neutral-50 dark:text-white border-b-transparent'
        );

        return acc;
      },
      {} as Record<number, string>
    );
  }, [activeId, initialTabs]);

  const activeTab = useMemo(() => initialTabs.find((tab) => tab.id === activeId), [initialTabs, activeId]);

  return (
    <section className="max-w-[90%] mx-auto py-10">
      <div className="flex justify-between flex-wrap items-start w-full gap-5 md:gap-15">
        <div className="w-full lg:w-[calc(30%_-_30px)] flex md:flex-row flex-col justify-between lg:justify-baseline lg:flex-col gap-2 md:gap-3">
          {initialTabs.map((tab) => (
            <div key={tab.id} onClick={tabClickHandlers[tab.id]} className={tabClassNames[tab.id]}>
              {tab.title}
            </div>
          ))}
        </div>
        <div className="w-full lg:w-[calc(70%_-_30px)] flex flex-col gap-4 md:gap-8" ref={contentRef}>
          {activeTab && <div key={activeTab.id}>{activeTab.content}</div>}
        </div>
      </div>
    </section>
  );
};
