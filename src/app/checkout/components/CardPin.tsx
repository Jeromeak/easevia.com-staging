import { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

export const CardPin = () => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^[0-9]?$/.test(value)) return;
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [pin]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace' && !pin[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [pin]
  );
  const setInputRef = useCallback((el: HTMLInputElement | null, index: number) => {
    inputRefs.current[index] = el;
  }, []);

  const inputHandlers = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => ({
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value),
        onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index),
        setRef: (el: HTMLInputElement | null) => setInputRef(el, index),
      })),
    [handleChange, handleKeyDown, setInputRef]
  );

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <div className="text-[#ccc] text-[18px] md:text-base font-medium mt-8 text-center w-full md:w-auto">
        Enter your 4-digit card PIN to confirm this payment
      </div>
      <div className="flex items-center justify-center gap-4 pb-10 md:pb-50 mt-5 md:mt-10 w-full">
        {pin.map((_, index) => (
          <input
            key={index}
            ref={inputHandlers[index].setRef}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={pin[index]}
            onChange={inputHandlers[index].onChange}
            onKeyDown={inputHandlers[index].onKeyDown}
            className={clsx(
              'w-[50px] h-[52px] outline-none text-center text-xl rounded-sm border-[1.5px] border-gray-250'
            )}
          />
        ))}
      </div>
    </div>
  );
};
