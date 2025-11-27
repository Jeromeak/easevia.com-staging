import { countryOptions } from '@/common/components/Data';
import CustomSelect from '@/common/components/Select';
import { useCallback } from 'react';

export const BankTab = () => {
  const handleCountryChange = useCallback(() => {}, []);
  const handleBankChange = useCallback(() => {}, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="text-[#666] text-base font-medium leading-5">Country </div>
        <div className="w-full mt-3">
          <CustomSelect
            placeholder="Select a country"
            className="w-full !rounded-t-[7px]"
            options={countryOptions}
            onChange={handleCountryChange}
          />
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <div className="text-[#666] text-base font-medium leading-5">Local Bank Transfer </div>
        <div className="w-full mt-3">
          <CustomSelect
            placeholder="Local Bank Transfer"
            className="w-full !rounded-t-[7px]"
            options={countryOptions}
            onChange={handleBankChange}
          />
        </div>
      </div>
    </div>
  );
};
