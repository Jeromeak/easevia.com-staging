'use client';

import { Fragment, useCallback, useEffect, useState, useMemo } from 'react';
import CustomDropdown from '@/common/components/Select';
import { Input } from './Input';
import { genderOptions } from '@/common/components/Data';
import CustomDatePicker from './CustomInput';
import { WarningIcon } from '@/icons/icon';
import { useAuth } from '@/context/hooks/useAuth';
import { getAccessToken } from '@/utils/tokenStorage';
import { updateUserProfile } from '@/lib/api/user';
import { useLocationDropdowns } from '@/hooks/useLocationDropdowns';
import type { UserProfile } from '@/lib/types/api/user';
import { Button } from '@/app/authentication/components/Button';
import { enforceCharacterLimit, validateName, validatePincode } from '@/utils/fieldValidation';

export const ProfileTab = () => {
  const { user, setUser } = useAuth();
  const {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    error: locationError,
    loadStates,
    loadCities,
  } = useLocationDropdowns();

  const initialFormState = {
    name: '',
    gender: '',
    date_of_birth: '',
    nationality: '',
    address: '',
    billingAddress: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
  };

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);

  const [originalData, setOriginalData] = useState<typeof initialFormState>(initialFormState);

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      const userProfile = user as UserProfile;
      const userData = {
        name: userProfile?.name || '',
        nationality: userProfile?.nationality || '',
        gender: userProfile?.gender || '',
        date_of_birth: userProfile?.date_of_birth || '',
        address: userProfile?.address || '',
        billingAddress: userProfile?.billing_address || '',
        pincode: userProfile?.pincode || '',
        country: userProfile?.country || '',
        state: userProfile?.state || '',
        city: userProfile?.city || '',
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validate name: only letters and spaces, max 20 characters
    if (name === 'name') {
      const validatedValue = validateName(value, 20);
      setFormData((prev) => ({ ...prev, [name]: validatedValue }));

      return;
    }

    // Validate pincode: only allow numbers and limit to 11 characters
    if (name === 'pincode') {
      const validatedValue = validatePincode(value, 11);
      setFormData((prev) => ({ ...prev, [name]: validatedValue }));

      return;
    }

    // Validate address fields: max 256 characters
    if (name === 'address' || name === 'billingAddress') {
      const limitedValue = enforceCharacterLimit(value, 256);
      setFormData((prev) => ({ ...prev, [name]: limitedValue }));

      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    if (formData.country) {
      loadStates(formData.country);
    }
  }, [formData.country, loadStates]);

  useEffect(() => {
    if (formData.country && formData.state) {
      loadCities(formData.country, formData.state);
    }
  }, [formData.country, formData.state, loadCities]);

  const handleCountryChange = useCallback(
    (option: { label: string; value: string }) => {
      const newCountry = option.value;

      setFormData((prev) => ({
        ...prev,
        country: newCountry,
        state: '',
        city: '',
      }));

      loadStates(newCountry);
    },
    [loadStates]
  );

  const handleStateChange = useCallback(
    (option: { label: string; value: string }) => {
      const newState = option.value;

      setFormData((prev) => ({
        ...prev,
        state: newState,
        city: '',
      }));

      loadCities(formData.country, newState);
    },
    [formData.country, loadCities]
  );

  const handleDOBChange = useCallback((value: string | null) => {
    setFormData((prev) => ({ ...prev, date_of_birth: value ?? '' }));
  }, []);

  const handleDropdownChange = useCallback(
    (field: keyof typeof formData) => (option: { label: string; value: string }) => {
      setFormData((prev) => ({ ...prev, [field]: option.value }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    const hasChanges = Object.keys(formData).some((key) => {
      const formValue = formData[key as keyof typeof formData];
      const originalValue = originalData[key as keyof typeof originalData];

      return formValue !== originalValue;
    });

    if (!hasChanges) {
      setSuccess('');
      setLoading(false);

      return;
    }

    try {
      const token = getAccessToken();
      if (!token) throw new Error('Not authenticated');

      const payload = {
        name: formData?.name,
        gender: formData?.gender?.toLowerCase(),
        date_of_birth: formData?.date_of_birth,
        nationality: formData?.nationality,
        address: formData?.address,
        billing_address: formData?.billingAddress,
        pincode: formData?.pincode,
        country: formData?.country,
        state: formData?.state,
        city: formData?.city,
      };

      const response = await updateUserProfile(token, payload);
      setUser(response.data);
      setSuccess('Profile updated successfully!');

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to update profile');
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  }, [formData, originalData, setUser]);

  const nationalityValue = useMemo(
    () => (formData.nationality ? { label: formData.nationality, value: formData.nationality } : undefined),
    [formData.nationality]
  );
  const genderValue = useMemo(
    () => genderOptions.find((option) => option.value === formData.gender) || undefined,
    [formData.gender]
  );
  const countryValue = useMemo(
    () => (formData.country ? { label: formData.country, value: formData.country } : undefined),
    [formData.country]
  );
  const stateValue = useMemo(
    () => (formData.state ? { label: formData.state, value: formData.state } : undefined),
    [formData.state]
  );
  const cityValue = useMemo(
    () => (formData.city ? { label: formData.city, value: formData.city } : undefined),
    [formData.city]
  );

  return (
    <Fragment>
      <div className="w-full lg:flex hidden lg:static sticky top-[77px] flex-wrap z-50  justify-between rounded-e-sm items-center px-5 md:px-8 h-20 bg-[#E6F2F2] dark:bg-gray-300">
        <div className="md:text-32 text-2xl md:leading-[32px] text-neutral-50 dark:text-white tracking-wider uppercase font-Neutra">
          My Profile
        </div>
        <div>
          <button
            className="bg-Teal-500 Teal text-white px-8 uppercase text-sm cursor-pointer py-1.5 rounded-full"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full md:mt-10 lg:mt-0 mt-25  p-5 md:p-8">
        <div className="text-gray-200 text-xl font-Neutra uppercase">Personal Information</div>
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-b-[#E5E5E5] dark:border-b-[#343434] pb-8 mt-5">
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <Input
              value={formData.name}
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="Name"
              maxLength={20}
            />
          </div>
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <CustomDropdown
              placeholder="Nationality"
              className="!px-5 !py-4 !rounded-sm dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal text-neutral-50 dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none"
              options={countries}
              onChange={handleDropdownChange('nationality')}
              value={nationalityValue}
            />
          </div>
          <div className="w-full lg:w-[calc(50%_-_8px)] flex justify-between flex-wrap items-center gap-4">
            <div className="w-full md:w-[calc(50%_-_8px)]">
              <CustomDropdown
                placeholder="Gender"
                className="!px-5 !py-4 !rounded-sm dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal dark:!text-white !border-[#9EA2AE] !border dark:!border-[#343434] outline-none"
                options={genderOptions}
                onChange={handleDropdownChange('gender')}
                value={genderValue}
              />
            </div>
            <div className="w-full md:w-[calc(50%_-_8px)]">
              <CustomDatePicker value={formData.date_of_birth} onChange={handleDOBChange} />
            </div>
          </div>
          <div className="w-full lg:w-[calc(50%_-_8px)]">
            <Input
              value={formData.address}
              onChange={handleChange}
              name="address"
              type="text"
              placeholder="Residence Address (optional)"
              maxLength={256}
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col pt-8">
            <div className="text-gray-200 text-xl font-Neutra uppercase">Billing Details</div>
            <div className="flex items-center gap-3 px-4 py-2 mt-3 rounded bg-[#FFF2C5] dark:bg-[#453316]">
              <div>
                <WarningIcon className="text-[#FF9800] dark:text-[#F6C624]" />
              </div>
              <p className="text-[14px] font-normal leading-[20px] font-FuturaPT text-[#FF9800] dark:text-[#F6C624]">
                As per government directive, billing address is compulsory for all bookings.
              </p>
            </div>
            <div className="flex justify-between items-center flex-wrap gap-4 mt-5 pb-8">
              <div className="w-full md:w-[calc(50%_-_8px)]">
                <Input
                  value={formData.billingAddress}
                  onChange={handleChange}
                  name="billingAddress"
                  type="text"
                  placeholder="Enter Billing Address"
                  maxLength={256}
                />
              </div>
              <div className="w-full md:w-[calc(50%_-_8px)]">
                <Input
                  value={formData.pincode}
                  onChange={handleChange}
                  name="pincode"
                  type="text"
                  placeholder="Enter Pincode"
                  maxLength={11}
                  inputMode="numeric"
                />
              </div>
              <div className="w-full lg:w-[calc(50%_-_8px)]">
                <CustomDropdown
                  placeholder={loadingCountries ? 'Loading...' : 'Country'}
                  className="!px-5 !py-4 !rounded-sm dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none"
                  options={countries}
                  onChange={handleCountryChange}
                  value={countryValue}
                />
              </div>
              <div className="w-full lg:w-[calc(50%_-_8px)] flex flex-wrap justify-between gap-4">
                <div className="w-full md:w-[calc(50%_-_8px)]">
                  <CustomDropdown
                    placeholder={loadingStates ? 'Loading...' : 'State'}
                    className="!px-5 !py-4 !rounded-sm dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none"
                    options={states}
                    onChange={handleStateChange}
                    value={stateValue}
                  />
                </div>
                <div className="w-full md:w-[calc(50%_-_8px)]">
                  <CustomDropdown
                    placeholder={loadingCities ? 'Loading...' : 'City'}
                    className="!px-5 !py-4 !rounded-sm dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none"
                    options={cities}
                    onChange={handleDropdownChange('city')}
                    value={cityValue}
                  />
                </div>
                <div className="w-full lg:hidden block">
                  <Button label="SAVE" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {locationError && <div className="text-red-500 mb-2">{locationError}</div>}
      </div>
    </Fragment>
  );
};
