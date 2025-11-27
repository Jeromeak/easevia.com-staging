import { useCallback, useState, useEffect } from 'react';
import { EditIcon } from '@/icons/icon';
import { PaymentInput } from './PaymentInput';
import CustomDropdown from '@/common/components/Select';
import clsx from 'clsx';
import type { FormDataTypes, FormErrors, OptionType } from '@/lib/types/common.types';
import { useAuth } from '@/context/hooks/useAuth';
import { useCheckout } from '@/context/hooks/useCheckout';
import { fetchUserInfo, updateUserProfile } from '@/lib/api/user';
import { getAccessToken } from '@/utils/tokenStorage';
import { useLocationDropdowns } from '@/hooks/useLocationDropdowns';
import { validatePincode } from '@/utils/fieldValidation';

export const BillingAddress = () => {
  const { user } = useAuth();
  const { setAddressComplete, setAddressValidated } = useCheckout();
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const [hasLoadedProfile, setHasLoadedProfile] = useState<boolean>(false);
  const [userProfileData, setUserProfileData] = useState<{
    country?: string;
    state?: string;
    city?: string;
  } | null>(null);

  // Location dropdowns hook
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

  const [formData, setFormData] = useState<FormDataTypes>({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: undefined,
    city: undefined,
    state: undefined,
    pincode: '',
  });

  // Store original form data to restore on cancel
  const [originalFormData, setOriginalFormData] = useState<FormDataTypes | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = useCallback((key: keyof typeof formData, value: unknown) => {
    if (key === 'phone') {
      // Allow + symbol for international phone numbers
      const phoneValue = String(value).replace(/[^0-9+]/g, '');
      setFormData((prev) => ({ ...prev, [key]: phoneValue }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));

      return;
    }

    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value),
    [handleInputChange]
  );
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value),
    [handleInputChange]
  );
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value),
    [handleInputChange]
  );
  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value),
    [handleInputChange]
  );
  const handlePincodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Use common validation function: only allow numbers and limit to 11 characters
      const validatedValue = validatePincode(value, 11);
      handleInputChange('pincode', validatedValue);
    },
    [handleInputChange]
  );
  // Handle country change with cascading effect
  const handleCountryChange = useCallback(
    (val: OptionType) => {
      const newCountry = val;

      // Clear state and city when country changes
      setFormData((prev) => ({
        ...prev,
        country: newCountry,
        state: undefined,
        city: undefined,
      }));

      // Clear errors for country and dependent fields
      setErrors((prev) => ({
        ...prev,
        country: undefined,
        state: undefined,
        city: undefined,
      }));

      // Load states for the new country
      if (newCountry?.value) {
        loadStates(newCountry.value);
      }
    },
    [loadStates]
  );

  // Handle state change with cascading effect
  const handleStateChange = useCallback(
    (val: OptionType) => {
      const newState = val;

      // Clear city when state changes
      setFormData((prev) => ({
        ...prev,
        state: newState,
        city: undefined,
      }));

      // Clear errors for state and city
      setErrors((prev) => ({
        ...prev,
        state: undefined,
        city: undefined,
      }));

      // Load cities for the new state
      if (newState?.value && formData.country?.value) {
        loadCities(formData.country.value, newState.value);
      }
    },
    [formData.country, loadCities]
  );

  // Handle city change (no cascading effect)
  const handleCityChange = useCallback((val: OptionType) => handleInputChange('city', val), [handleInputChange]);

  // Load cities when both country and state are available
  useEffect(() => {
    if (formData.country?.value && formData.state?.value) {
      loadCities(formData.country.value, formData.state.value);
    }
  }, [formData.country?.value, formData.state?.value, loadCities]);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};

    // Validate Full Name
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    // Validate Address
    if (!formData.address || !formData.address.trim()) {
      newErrors.address = 'Residence Address is required';
    }

    // Validate Country - check if object exists and has a value
    if (!formData.country || !formData.country.value || !formData.country.value.trim()) {
      newErrors.country = 'Country is required';
    }

    // Validate State - check if object exists and has a value
    if (!formData.state || !formData.state.value || !formData.state.value.trim()) {
      newErrors.state = 'State is required';
    }

    // Validate City - check if object exists and has a value
    if (!formData.city || !formData.city.value || !formData.city.value.trim()) {
      newErrors.city = 'City is required';
    }

    // Validate Pincode
    if (!formData.pincode || !formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    setIsSaving(true);
    setSaveError('');

    try {
      const token = getAccessToken();

      if (!token) {
        throw new Error('No access token found');
      }

      const updateData = {
        name: formData.name,
        address: formData.address,
        country: formData.country?.value || '',
        city: formData.city?.value || '',
        state: formData.state?.value || '',
        pincode: formData.pincode,
      };

      await updateUserProfile(token, updateData);

      // Update original form data after successful save
      setOriginalFormData({ ...formData });
      setIsEditing(false);
      setAddressComplete(true);
      setAddressValidated(true);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      setSaveError('Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [validate, formData, setAddressComplete, setAddressValidated]);

  const handleEdit = useCallback(() => {
    // Store current form data as original before editing
    setOriginalFormData({ ...formData });
    setIsEditing(true);
  }, [formData]);

  const handleCancel = useCallback(() => {
    // Restore original form data if it exists
    if (originalFormData) {
      setFormData({ ...originalFormData });
    }

    // Clear all errors
    setErrors({});

    // Exit edit mode
    setIsEditing(false);
  }, [originalFormData]);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || hasLoadedProfile) return;

      setSaveError('');

      try {
        const token = getAccessToken();

        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetchUserInfo(token);

        const userData = response.data;

        // Map API response to form data
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || userData.billing_address || '',
          country: undefined, // Will be set after countries are loaded
          city: undefined, // Will be set after cities are loaded
          state: undefined, // Will be set after states are loaded
          pincode: userData.pincode || '',
        });

        // Check if all required fields are filled
        const hasAllFields =
          userData.name &&
          userData.email &&
          userData.phone &&
          (userData.address || userData.billing_address) &&
          userData.country &&
          userData.city &&
          userData.state &&
          userData.pincode;

        if (hasAllFields) {
          setAddressComplete(true);
          setAddressValidated(true);
          setIsEditing(false);
        } else {
          setAddressComplete(false);
          setAddressValidated(false);
        }

        setHasLoadedProfile(true);

        // Store location data for matching with dropdowns
        setUserProfileData({
          country: userData.country,
          state: userData.state,
          city: userData.city,
        });

        // Load states if country is available
        if (userData.country) {
          await loadStates(userData.country);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setSaveError('Failed to load profile data');
        setAddressComplete(false);
        setAddressValidated(false);
      }
    };

    fetchUserProfile();
  }, [user, hasLoadedProfile, loadStates, setAddressComplete, setAddressValidated]);

  // Match country from API with dropdown options after countries are loaded
  useEffect(() => {
    if (!hasLoadedProfile || !countries.length || formData.country || !userProfileData?.country) return;

    const matchedCountry = countries.find(
      (c) => c.value === userProfileData.country || c.label === userProfileData.country
    );

    if (matchedCountry) {
      setFormData((prev) => ({
        ...prev,
        country: matchedCountry,
      }));

      // Load states for the matched country
      loadStates(matchedCountry.value);
    }
  }, [countries, hasLoadedProfile, userProfileData, loadStates]);

  // Match state from API with dropdown options after states are loaded
  useEffect(() => {
    if (!hasLoadedProfile || !states.length || formData.state || !formData.country || !userProfileData?.state) return;

    const matchedState = states.find((s) => s.value === userProfileData.state || s.label === userProfileData.state);

    if (matchedState) {
      setFormData((prev) => ({
        ...prev,
        state: matchedState,
      }));

      // Load cities for the matched state
      if (formData.country?.value) {
        loadCities(formData.country.value, matchedState.value);
      }
    }
  }, [states, hasLoadedProfile, formData.country, userProfileData, loadCities]);

  // Match city from API with dropdown options after cities are loaded
  useEffect(() => {
    if (!hasLoadedProfile || !cities.length || formData.city || !formData.state || !userProfileData?.city) return;

    const matchedCity = cities.find((c) => c.value === userProfileData.city || c.label === userProfileData.city);

    if (matchedCity) {
      setFormData((prev) => {
        const updated = {
          ...prev,
          city: matchedCity,
        };

        // Store as original data once all fields are matched
        if (!originalFormData && updated.country && updated.state && updated.city) {
          setOriginalFormData({ ...updated });
        }

        return updated;
      });
    }
  }, [cities, hasLoadedProfile, formData.state, userProfileData, originalFormData]);

  return (
    <div className="w-full md:container md:mx-auto md:px-4">
      <div className="flex items-start md:items-end justify-between gap-2 md:gap-10 self-stretch">
        <div
          className={clsx(
            'font-Neutra',
            !isEditing ? 'w-auto md:w-[60%]' : 'w-full',
            'dark:text-white pb-1 border-b dark:border-b-white border-b-[#ACACAC] text-32 leading-normal tracking-[-0.96px] uppercase whitespace-nowrap'
          )}
        >
          Billing Address
        </div>
        {!isEditing && (
          <button
            type="button"
            className="flex justify-center items-center text-white gap-2 py-[8.3px] px-[19.92px] md:py-2.5 md:px-8 cursor-pointer rounded-full bg-Teal-500 flex-shrink-0"
            onClick={handleEdit}
          >
            <EditIcon />
            Edit
          </button>
        )}
      </div>

      <div className="flex flex-col items-start gap-5 self-stretch pb-0 md:gap-6 w-full mt-5 md:mt-10">
        {isEditing ? (
          <>
            <div className="w-full">
              <PaymentInput
                placeholder="Full Name"
                value={formData.name}
                onChange={handleNameChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <div className="text-red-500 text-sm mt-1 ml-1">{errors.name}</div>}
            </div>
            <PaymentInput
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleEmailChange}
              className="opacity-60 cursor-not-allowed"
              disabled={true}
            />
            <PaymentInput
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="opacity-60 cursor-not-allowed"
              disabled={true}
            />
            <div className="w-full">
              <PaymentInput
                placeholder="Residence Address"
                value={formData.address}
                onChange={handleAddressChange}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <div className="text-red-500 text-sm mt-1 ml-1">{errors.address}</div>}
            </div>
            <div className="flex justify-between flex-wrap items-center w-full gap-4">
              <div className="w-full md:w-[calc(50%_-_8px)]">
                <CustomDropdown
                  placeholder={loadingCountries ? 'Loading...' : 'Country'}
                  value={formData.country}
                  options={countries}
                  onChange={handleCountryChange}
                  className={clsx(
                    '!px-5 !py-4 !rounded-sm bg-white dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal dark:!text-white  outline-none',
                    {
                      'border-red-500': errors.country,
                      '!border !border-[#9EA2AE] dark:!border-[#343434]': !errors.country,
                    }
                  )}
                />
                {errors.country && <div className="text-red-500 text-sm mt-1 ml-1">{errors.country}</div>}
              </div>
              <div className="w-full md:w-[calc(50%_-_8px)]">
                <CustomDropdown
                  placeholder={loadingStates ? 'Loading...' : 'State'}
                  value={formData.state}
                  options={states}
                  onChange={handleStateChange}
                  className={clsx(
                    '!px-5 !py-4 !rounded-sm bg-white dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal dark:!text-white  outline-none',
                    {
                      'border-red-500': errors.state,
                      '!border !border-[#9EA2AE] dark:!border-[#343434]': !errors.state,
                    }
                  )}
                />
                {errors.state && <div className="text-red-500 text-sm mt-1 ml-1">{errors.state}</div>}
              </div>
            </div>
            <div className="flex justify-between flex-wrap items-center w-full gap-4">
              <div className="w-full md:w-[calc(50%_-_8px)]">
                <CustomDropdown
                  placeholder={loadingCities ? 'Loading...' : 'City'}
                  value={formData.city}
                  options={cities}
                  onChange={handleCityChange}
                  className={clsx(
                    '!px-5 !py-4 !rounded-sm bg-white dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal dark:!text-white  outline-none',
                    {
                      'border-red-500': errors.city,
                      '!border !border-[#9EA2AE] dark:!border-[#343434]': !errors.city,
                    }
                  )}
                />
                {errors.city && <div className="text-red-500 text-sm mt-1 ml-1">{errors.city}</div>}
              </div>
              <div className="w-full md:w-[calc(50%_-_8px)]">
                <PaymentInput
                  placeholder="Enter Pincode"
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  className={errors.pincode ? 'border-red-500' : ''}
                  maxLength={11}
                  inputMode="numeric"
                />
                {errors.pincode && <div className="text-red-500 text-sm mt-1 ml-1">{errors.pincode}</div>}
              </div>
            </div>

            <div className="py-5 dark:md:py-10 gap-5 flex  mt-5 dark:md:mt-10">
              <button
                type="button"
                className="text-white cursor-pointer font-Mada leading-4 font-semibold text-sm bg-Teal-500 py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                className="text-neutral-50 dark:text-white cursor-pointer text-sm font-Mada leading-4"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
            {saveError && <div className="text-red-500 text-sm mt-2">{saveError}</div>}
            {locationError && <div className="text-red-500 text-sm mt-2">{locationError}</div>}
          </>
        ) : (
          <div className="flex flex-col mt-5 space-y-3">
            <div className="flex flex-col">
              <div className="dark:text-white/80 text-neutral-50 dark:md:text-white text-[36px] md:text-4xl font-semibold md:font-normal font-Neutra uppercase leading-[44px] md:leading-tight">
                {formData.name?.trim() || user?.name || '-'}
              </div>
            </div>

            <div className="flex flex-col space-y-0">
              <div className="text-[#9EA2AD] text-sm md:text-xl">{formData.email?.trim() || user?.email || '-'}</div>
              <div className="text-[#9EA2AD] text-sm md:text-xl">{formData.phone?.trim() || user?.phone || '-'}</div>
            </div>

            <div className="flex flex-col space-y-0">
              <div className="text-[#9EA2AD] text-sm md:text-xl">{formData.address?.trim() || '-'}</div>
              <div className="text-[#9EA2AD] text-sm md:text-xl">
                {[formData.city?.label, formData.state?.label, formData.pincode?.trim()]
                  .filter((value) => value && value.length > 0)
                  .join(', ') || '-'}
              </div>
              <div className="text-[#9EA2AD] text-sm md:text-xl">{formData.country?.label || '-'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
