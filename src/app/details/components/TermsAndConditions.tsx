'use client';
import { ArrowLeft } from '@/icons/icon';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';

export const TermsAndConditions = () => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const sectionClassName = useMemo(() => clsx('bg-gray-300 overflow-hidden'), []);
  const containerClassName = useMemo(() => clsx('py-30 max-w-[85%] mx-auto'), []);
  const flexClassName = useMemo(() => clsx('flex justify-between items-end w-full'), []);
  const titleClassName = useMemo(
    () => clsx('text-90 leading-22.5 font-Neutra uppercase tracking-[3px] text-orange-200'),
    []
  );
  const tealClassName = useMemo(() => clsx('text-Teal-500'), []);
  const rightFlexClassName = useMemo(() => clsx('flex items-center gap-5'), []);
  const readClassName = useMemo(() => clsx('text-xl text-gray-600 font-normal'), []);
  const btnClassName = useMemo(
    () => clsx('w-20 cursor-pointer flex justify-center items-center h-20 rounded-full border-2 border-gray-600'),
    []
  );
  const arrowClassName = useMemo(() => clsx('transform -rotate-90'), []);

  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <div className={flexClassName}>
          <div className={titleClassName}>
            <span className={tealClassName}>Terms &</span>
            <br /> Conditions
          </div>
          <div className={rightFlexClassName}>
            <div className={readClassName}>Click to read</div>
            <button role="button" type="button" className={btnClassName} onClick={handleBack}>
              <ArrowLeft className={arrowClassName} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
