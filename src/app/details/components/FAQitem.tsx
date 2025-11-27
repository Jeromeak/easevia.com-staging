import { AdditionIcon } from '@/icons/icon';
import type { FAQItemsProps } from '@/lib/types/common.types';
import { useRef, useCallback, useMemo } from 'react';
import clsx from 'clsx';

export const FAQItem: React.FC<FAQItemsProps> = ({ question, isOpen, answer, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (onToggle) onToggle();
  }, [onToggle]);

  const iconClassName = useMemo(() => clsx('transform duration-500', isOpen ? 'rotate-45' : 'rotate-180'), [isOpen]);

  const buttonClassName = useMemo(
    () =>
      clsx(
        'flex cursor-pointer justify-between items-start md:pb-5 tracking-wider w-full font-Neutra text-2xl lg:text-32 uppercase'
      ),
    []
  );

  const questionClassName = useMemo(() => clsx('w-[90%] lg:w-[95%] text-start text-neutral-50 dark:text-white'), []);

  const iconWrapperClassName = useMemo(
    () => clsx('flex justify-center text-orange-200 w-9 h-9 border border-orange-200 rounded-full items-center'),
    []
  );

  const contentClassName = useMemo(() => clsx('overflow-hidden transition-all duration-500 ease-in-out'), []);

  const containerClassName = useMemo(() => clsx('border-b border-gray-900 pt-8 pb-3 lg:py-8 w-full'), []);

  return (
    <div className={containerClassName}>
      <button onClick={handleClick} className={buttonClassName} type="button">
        <div className={questionClassName}>{question}</div>
        <div className={iconWrapperClassName}>
          <AdditionIcon className={iconClassName} />
        </div>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
        className={contentClassName}
      >
        <p className={clsx('mt-2 text-lg lg:text-xl text-orange-200')}>{answer}</p>
      </div>
    </div>
  );
};
