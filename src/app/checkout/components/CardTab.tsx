'use client';
import { useState } from 'react';
import { countryOptions } from '@/common/components/Data';
import CustomSelect from '@/common/components/Select';
import { CreditCardIcon, MasterCardGray, MasterCardWhite } from '@/icons/icon';

export const CardTab = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }

    return v;
  };

  // Format CVV (max 4 digits)
  const formatCvv = (value: string) => {
    return value.replace(/[^0-9]/gi, '').substring(0, 4);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);

    if (formatted.length <= 19) {
      // Max length for formatted card number
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCvv(e.target.value);
    setCvv(formatted);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full mt-0">
        <div className="flex items-center rounded-lg border-[0.8px] border-solid border-[#D9DEDF] dark:border-inputsecondary dark:bg-neutral-50 px-4 py-3">
          <span className="mr-3 dark:block hidden">
            <MasterCardGray />
          </span>
          <span className="mr-3 dark:hidden block">
            <MasterCardWhite />
          </span>
          <input
            placeholder="1234 5678 9012 3456"
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            className="w-full pr-40 placeholder:text-gray-290 bg-neutral-50 px-4 outline-none rounded-t-[7px] border border-inputsecondary py-2.5"
          />
        </div>
        <div className="flex flex-wrap items-center">
          <div className="md:w-1/2 w-full">
            <input
              placeholder="MM / YY"
              type="text"
              value={expiryDate}
              onChange={handleExpiryChange}
              maxLength={5}
              className="w-full placeholder:text-gray-290 bg-neutral-50 px-4 outline-none rounded-bl-[7px] border border-inputsecondary py-2.5"
            />
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="gap-2 absolute right-4 top-1/2 -translate-y-1/2">
              <CreditCardIcon />
            </div>
            <input
              placeholder="CVC"
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              maxLength={4}
              className="w-full placeholder:text-gray-290 pr-14 bg-neutral-50 px-4 outline-none rounded-br-[7px] border border-inputsecondary py-2.5"
            />
          </div>
        </div>
        <div className="flex flex-col mt-4 md:mt-8">
          <div className="text-[#666] text-base font-medium leading-5">Cardholder name</div>
          <div className="mt-3">
            <input
              placeholder="Full name on card"
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full placeholder:text-gray-290 bg-neutral-50 px-4 outline-none rounded-[7px] border border-inputsecondary py-2.5"
            />
          </div>
        </div>
        <div className="flex flex-col mt-4 md:mt-8">
          <div className="text-[#666] text-base font-medium leading-5">Country or region</div>
          <div className="w-full mt-3">
            <CustomSelect
              placeholder="Select a country"
              className="w-full !rounded-t-[7px] "
              options={countryOptions}
              onChange={() => {}}
            />
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Address line 1"
              className="w-full  placeholder:text-gray-290 bg-neutral-50 px-4 outline-none  border border-inputsecondary py-2.5"
            />
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Address line 2"
              className="w-full  placeholder:text-gray-290 bg-neutral-50 px-4 outline-none  border border-inputsecondary py-2.5"
            />
          </div>
          <div className="w-full flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="City"
                className="w-full  placeholder:text-gray-290 bg-neutral-50 px-4 outline-none  border border-inputsecondary py-2.5"
              />
            </div>
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Postal code"
                className="w-full  placeholder:text-gray-290 bg-neutral-50 px-4 outline-none  border border-inputsecondary py-2.5"
              />
            </div>
          </div>
          <div className="w-full ">
            <CustomSelect
              placeholder="Select a state"
              className="w-full !rounded-b-[7px] "
              options={countryOptions}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
