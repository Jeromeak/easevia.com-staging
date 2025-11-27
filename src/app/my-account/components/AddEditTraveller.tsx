'use client';
import { Fragment, useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from './Input';
import CustomDropdown from '@/common/components/Select';
import type { Option } from '@/lib/types/common.types';
import { genderOptions, relationshipOptions as relationshipOptionsCommon } from '@/common/components/Data';
import { useLocationDropdowns } from '@/hooks/useLocationDropdowns';
import CustomDatePicker from './CustomInput';
import ExpiryDatePicker from './ExpiryDate';
import { WarningIcon, ArrowLeft } from '@/icons/icon';
import type { AddEditTravellerProps } from '@/lib/types/common.types';
import { FormMode } from '@/lib/types/common.types';
import { Button } from '@/app/authentication/components/Button';
import { Modal } from '@/app/authentication/components/Modal';
import type { Passenger, PassengerCreateRequest, PassengerUpdateRequest } from '@/lib/types/api/passenger';
import type { SubscriptionPassenger } from '@/lib/types/api/subscription';
import { addPassenger, editPassenger } from '@/services/passengerCache';
import { fetchPassengerById } from '@/lib/api/passenger';
import { validatePassengerForm } from '@/services/validation';
import { usePassengerFlow } from '@/hooks/usePassengerFlow';
import {
  validateName,
  validateMobileNumber,
  enforceCharacterLimit,
  isValidEmailFormat,
  isValidMobileFormat,
} from '@/utils/fieldValidation';

export const AddEditTraveller: React.FC<AddEditTravellerProps> = ({ setActiveTab, mode, passengerId }) => {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscriptionId');
  const { handlePassengerAdded, handlePassengerEdited, navigateToSubscriptionTab } = usePassengerFlow();

  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    gender: '',
    date_of_birth: '',
    relationship_with_user: '',
    mobile_number: '',
    email: '',
    passport_given_name: '',
    passport_surname: '',
    passport_number: '',
    passport_expiry: '',
    passport_issuing_country: '',
  });
  const [loading, setLoading] = useState<boolean>(mode === 'edit');
  const [error, setError] = useState<string | Record<string, string> | null>(null);
  const [showAlertInfo] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [initialFormData, setInitialFormData] = useState<typeof formData>({
    name: '',
    nationality: '',
    gender: '',
    date_of_birth: '',
    relationship_with_user: '',
    mobile_number: '',
    email: '',
    passport_given_name: '',
    passport_surname: '',
    passport_number: '',
    passport_expiry: '',
    passport_issuing_country: '',
  });
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const { countries } = useLocationDropdowns();

  const handleChange = useCallback(
    (key: keyof typeof formData, value: string) => {
      setError(null);

      // Apply validation based on field type
      let validatedValue = value;

      // Name fields: only letters and spaces, max 20 characters
      if (key === 'name' || key === 'passport_given_name' || key === 'passport_surname') {
        validatedValue = validateName(value, 20);
      }
      // Mobile number: validate format and limit to 17 characters
      else if (key === 'mobile_number') {
        validatedValue = validateMobileNumber(value, 17);
      }
      // Email: limit to 254 characters
      else if (key === 'email') {
        validatedValue = enforceCharacterLimit(value, 254);
      }

      setFormData((prev) => {
        const newData = { ...prev, [key]: validatedValue };
        const hasChanges = JSON.stringify(newData) !== JSON.stringify(initialFormData);
        setHasUnsavedChanges(hasChanges);

        return newData;
      });
    },
    [initialFormData]
  );

  const handleCancel = useCallback(() => {
    const navigationAction = () => (subscriptionId ? navigateToSubscriptionTab() : setActiveTab('Passengers'));

    if (hasUnsavedChanges && mode === 'edit') {
      setPendingNavigation(() => navigationAction);
      setShowConfirmDialog(true);
    } else {
      navigationAction();
    }
  }, [setActiveTab, subscriptionId, navigateToSubscriptionTab, hasUnsavedChanges, mode]);

  const handleUpdateAndLeave = async () => {
    try {
      await handleSave();
      setShowConfirmDialog(false);

      if (pendingNavigation) {
        pendingNavigation();
        setPendingNavigation(null);
      }
    } catch (error) {
      console.error('Failed to save before navigation:', error);
    }
  };

  const handleRevertAndLeave = useCallback(() => {
    setShowConfirmDialog(false);
    setHasUnsavedChanges(false);

    setFormData(initialFormData);

    setError(null);

    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [pendingNavigation, initialFormData]);

  const handleCancelConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  useEffect(() => {
    if (mode === 'edit' && passengerId) {
      setLoading(true);
      fetchPassengerById(passengerId)
        .then((passenger) => {
          if (passenger && passenger.id) {
            const initial = mapPassengerToForm(passenger);
            setFormData(initial);
            setInitialFormData(initial);
          } else {
            setError('Passenger not found');
          }
        })
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load passenger'))
        .finally(() => setLoading(false));
    } else {
      // For add mode, set empty initial data
      const emptyData = {
        name: '',
        nationality: '',
        gender: '',
        date_of_birth: '',
        relationship_with_user: '',
        mobile_number: '',
        email: '',
        passport_given_name: '',
        passport_surname: '',
        passport_number: '',
        passport_expiry: '',
        passport_issuing_country: '',
      };
      setInitialFormData(emptyData);
    }
  }, [mode, passengerId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && mode === 'edit') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Please update or revert to continue.';

        return 'You have unsaved changes. Please update or revert to continue.';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges && mode === 'edit') {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
        setPendingNavigation(() => () => window.history.back());
        setShowConfirmDialog(true);
      }
    };

    const handleLinkClick = (e: MouseEvent) => {
      if (hasUnsavedChanges && mode === 'edit') {
        const target = e.target as HTMLElement;

        const link = target.closest(
          'a, button, [role="button"], [onclick], [data-navigate], nav *, header *, .menu *, [href]'
        );

        const isNavigational =
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.hasAttribute('onclick') ||
          target.hasAttribute('href') ||
          target.hasAttribute('data-navigate') ||
          target.getAttribute('role') === 'button' ||
          target.closest('nav, header, .menu, .navigation');
        const isInFormArea = target.closest('.confirmation-dialog, form, input, textarea, select, .dropdown');
        const isSaveButton =
          target.textContent?.toLowerCase().includes('save') ||
          target.textContent?.toLowerCase().includes('update') ||
          target.textContent?.toLowerCase().includes('saving') ||
          target.textContent?.toLowerCase().includes('updating') ||
          (target as HTMLElement & { onclick?: () => void }).onclick === handleSave ||
          (target.closest('button') as HTMLButtonElement)?.onclick === handleSave ||
          target.hasAttribute('data-save-button') ||
          target.closest('[data-save-button]');

        // Check if this is a discard/modal button (should be allowed)
        const isModalButton =
          target.closest('.confirmation-dialog') ||
          target.textContent?.toLowerCase().includes('discard') ||
          target.textContent?.toLowerCase().includes('cancel') ||
          target.textContent?.toLowerCase().includes('continue');

        if ((link || isNavigational) && !isInFormArea && !isSaveButton && !isModalButton) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          if (link instanceof HTMLAnchorElement && link.href) {
            setPendingNavigation(() => () => (window.location.href = link.href));
          } else if (
            link instanceof HTMLElement &&
            (link as HTMLElement & { onclick?: (event: Event) => void }).onclick
          ) {
            const clickHandler = (link as HTMLElement & { onclick: (event: Event) => void }).onclick;
            setPendingNavigation(() => () => clickHandler.call(link, e));
          } else {
            setPendingNavigation(() => () => console.log('Navigation blocked'));
          }

          setShowConfirmDialog(true);
        }
      }
    };

    if (hasUnsavedChanges && mode === 'edit') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);

      document.addEventListener('click', handleLinkClick, true);
      document.addEventListener('mousedown', handleLinkClick, true);

      document.addEventListener('keydown', (e) => {
        if (hasUnsavedChanges && mode === 'edit' && (e.key === 'F5' || (e.ctrlKey && e.key === 'r'))) {
          e.preventDefault();
          setShowConfirmDialog(true);
        }
      });

      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick, true);
      document.removeEventListener('mousedown', handleLinkClick, true);
    };
  }, [hasUnsavedChanges, mode]);

  const handleSave = async () => {
    //* Validate form
    const errors = validatePassengerForm(formData);

    // Additional validation for email format
    if (formData.email && !isValidEmailFormat(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Additional validation for email length
    if (formData.email && formData.email.length > 254) {
      errors.email = 'Email cannot exceed 254 characters.';
    }

    // Additional validation for mobile format
    if (formData.mobile_number && formData.mobile_number.length > 17) {
      errors.mobile_number = 'Mobile number cannot exceed 17 characters.';
    }

    // Additional validation for mobile format using common function
    if (formData.mobile_number && !isValidMobileFormat(formData.mobile_number)) {
      errors.mobile_number = 'Please enter a valid mobile number with country code (e.g. +1234567890).';
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);

      return;
    }

    try {
      setError(null);
      setLoading(true);

      if (mode === 'add') {
        const payload: PassengerCreateRequest = mapFormToCreatePayload(formData);
        const newPassenger = await addPassenger(payload);

        if (newPassenger && subscriptionId) {
          //* Convert Passenger to SubscriptionPassenger format
          const subscriptionPassenger: SubscriptionPassenger = {
            id: newPassenger.id,
            name: newPassenger.name,
            nationality: newPassenger.nationality,
            gender: newPassenger.gender,
            date_of_birth: newPassenger.date_of_birth,
            relationship_with_user: newPassenger.relationship_with_user,
            mobile_number: newPassenger.mobile_number,
            email: newPassenger.email,
            given_names: newPassenger.passport_given_name,
            surname: newPassenger.passport_surname,
            passport_number: newPassenger.passport_number,
            passport_expiry: newPassenger.passport_expiry,
            issuing_country: newPassenger.passport_issuing_country,
          };

          //* Use the new flow hook to handle passenger addition
          handlePassengerAdded(subscriptionPassenger, subscriptionId);
        } else {
          setActiveTab('Passengers');
        }
      } else if (mode === 'edit' && passengerId) {
        const payload: PassengerUpdateRequest = mapFormToUpdatePayload(formData);
        await editPassenger(passengerId, payload);
        handlePassengerEdited();
      }

      setLoading(false);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setLoading(false);
    }
  };

  const formattedPassportExpiry = useMemo(
    () => formatPassportExpiry(formData.passport_expiry),
    [formData.passport_expiry]
  );

  const relationshipOptions: Option[] = useMemo(() => relationshipOptionsCommon, []);

  return (
    <Fragment>
      <div className="lg:flex hidden w-full lg:static sticky top-[84px] z-100  md:justify-between justify-center flex-wrap gap-3 md:gap-0 rounded-e-sm items-center px-5 md:px-10 py-3  md:h-20 bg-[#E6F2F2] dark:bg-gray-300">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="flex h-8 p-1 justify-center items-center rounded-full border-[1.5px] border-[#009898] text-[#009898] hover:bg-[#009898] hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft width="24" height="24" />
          </button>
          <div className="md:text-32 text-2xl md:leading-[32px] text-neutral-50 dark:text-white tracking-wider uppercase font-Neutra">
            {mode === FormMode.EDIT ? 'Edit Passenger' : 'Add New Passenger'}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="bg-transparent border border-Teal-500 text-Teal-500 hover:text-white hover:bg-Teal-500 duration-500 px-8 uppercase text-sm cursor-pointer py-1.5 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            data-save-button="true"
            className="bg-Teal-500 Teal text-white px-8 uppercase text-sm cursor-pointer py-1.5 rounded-full"
          >
            {loading
              ? mode === FormMode.EDIT
                ? 'Updating...'
                : 'Saving...'
              : mode === FormMode.EDIT
                ? 'Update'
                : 'Save'}
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col mt-36 lg:mt-0 md:mt-20 p-5">
        {loading && <div className="text-white">Loading...</div>}
        {error && typeof error === 'string' && <div className="text-red-400">{error}</div>}
        <div className="text-gray-200 text-xl font-Neutra  uppercase ">Personal Information</div>
        <div className="flex justify-between pb-8 border-[#E5E5E5] dark:border-b-[#343434] border-b mt-5 items-center w-full flex-wrap gap-4">
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <Input
              value={formData.name}
              name="name"
              onChange={(e) => handleChange('name', e.target.value)}
              type="text"
              placeholder="Passenger Name"
              maxLength={20}
            />
            {error && typeof error === 'object' && error?.name && (
              <div className="text-red-500 text-sm">{error.name}</div>
            )}
          </div>
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <CustomDropdown
              placeholder="Nationality"
              className="!px-5 !py-4 !rounded-sm dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal text-neutral-50 dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none  "
              options={countries}
              onChange={(option: Option) => handleChange('nationality', option?.value || '')}
              value={formData.nationality ? { label: formData.nationality, value: formData.nationality } : undefined}
            />
            {error && typeof error === 'object' && error?.nationality && (
              <div className="text-red-500 text-sm">{error.nationality}</div>
            )}
          </div>
          <div className="w-full lg:w-[calc(50%_-_8px)] flex justify-between flex-wrap items-center gap-4">
            <div className="w-full md:w-[calc(50%_-_8px)]">
              <CustomDropdown
                placeholder="Gender"
                className="!px-5 !py-4 !rounded-sm dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal text-neutral-50 dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none  "
                options={genderOptions}
                onChange={(option) => handleChange('gender', option?.value || '')}
                value={genderOptions.find((option) => option.value === formData.gender) || undefined}
              />
              {error && typeof error === 'object' && error?.gender && (
                <div className="text-red-500 text-sm">{error.gender}</div>
              )}
            </div>
            <div className="w-full md:w-[calc(50%_-_8px)] relative">
              <CustomDatePicker
                value={formData.date_of_birth || ''}
                onChange={(v) => handleChange('date_of_birth', v || '')}
              />
              {error && typeof error === 'object' && error?.date_of_birth && (
                <div className="text-red-500 text-sm">{error.date_of_birth}</div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[calc(50%_-_8px)]">
            <CustomDropdown
              placeholder="Relationship with traveller"
              className="!px-5 !py-4 !rounded-sm bg-white dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal text-neutral-50 dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none  "
              options={relationshipOptions}
              value={
                formData.relationship_with_user
                  ? { label: formData.relationship_with_user, value: formData.relationship_with_user }
                  : undefined
              }
              onChange={(option: Option) => handleChange('relationship_with_user', option?.value || '')}
            />
            {error && typeof error === 'object' && error?.relationship_with_user && (
              <div className="text-red-500 text-sm">{error.relationship_with_user}</div>
            )}
          </div>
        </div>
        <div className="text-gray-200 text-xl font-Neutra mt-5  uppercase ">
          Add contact information to receive booking details & other alerts
        </div>
        <div className="flex justify-between pb-8 border-b-[#E5E5E5] dark:border-b-[#343434] border-b mt-5 items-center w-full flex-wrap gap-4">
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <Input
              value={formData.mobile_number}
              name="mobile"
              type="text"
              onChange={(e) => handleChange('mobile_number', e.target.value)}
              placeholder="Mobile number"
              maxLength={17}
            />
            {error && typeof error === 'object' && error?.mobile_number && (
              <div className="text-red-500 text-sm">{error.mobile_number}</div>
            )}
          </div>
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <Input
              value={formData.email}
              name="email"
              type="email"
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email ID"
              maxLength={254}
            />
            {error && typeof error === 'object' && error?.email && (
              <div className="text-red-500 text-sm">{error.email}</div>
            )}
          </div>
        </div>
        <div className="text-gray-200 text-xl font-Neutra mt-5  uppercase ">Documents Details</div>
        <div className="flex justify-between   mt-5 items-center w-full flex-wrap gap-4 mb-8">
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <Input
              value={formData.passport_given_name}
              name="names"
              type="text"
              onChange={(e) => handleChange('passport_given_name', e.target.value)}
              placeholder="Given Name(s)."
              maxLength={20}
            />
            {error && typeof error === 'object' && error?.passport_given_name && (
              <div className="text-red-500 text-sm">{error.passport_given_name}</div>
            )}
          </div>
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <Input
              value={formData.passport_surname}
              name="Surname"
              type="text"
              onChange={(e) => handleChange('passport_surname', e.target.value)}
              placeholder="Surname"
              maxLength={20}
            />
            {error && typeof error === 'object' && error?.passport_surname && (
              <div className="text-red-500 text-sm">{error.passport_surname}</div>
            )}
          </div>
          <div className="w-full md:w-[calc(50%_-_8px)]">
            <Input
              value={formData.passport_number}
              name="passport no."
              type="text"
              onChange={(e) => handleChange('passport_number', e.target.value)}
              placeholder="PASSPORT NO."
            />
            {error && typeof error === 'object' && error?.passport_number && (
              <div className="text-red-500 text-sm">{error.passport_number}</div>
            )}
          </div>
          <div className="w-full md:w-[calc(50%_-_8px)] relative">
            <ExpiryDatePickerControlled
              value={formData.passport_expiry || ''}
              onChange={(v) => handleChange('passport_expiry', v)}
            />
            {error && typeof error === 'object' && error?.passport_expiry && (
              <div className="text-red-500 text-sm">{error.passport_expiry}</div>
            )}
          </div>
          <div className="w-full lg:w-[calc(50%_-_8px)]">
            <CustomDropdown
              placeholder="Issuing Country"
              className="!px-5 !py-4 !rounded-sm bg-white dark:!bg-black focus:!border-orange-200 !duration-500 !placeholder:!text-[#7C797E] placeholder:!text-sm placeholder:!uppercase placeholder:!font-normal text-neutral-50 dark:!text-white !border !border-[#9EA2AE] dark:!border-[#343434] outline-none  "
              options={countries}
              onChange={(option: Option) => handleChange('passport_issuing_country', option?.value || '')}
              value={
                formData.passport_issuing_country
                  ? { label: formData.passport_issuing_country, value: formData.passport_issuing_country }
                  : undefined
              }
            />
            {error && typeof error === 'object' && error?.passport_issuing_country && (
              <div className="text-red-500 text-sm">{error.passport_issuing_country}</div>
            )}
          </div>
          {showAlertInfo && mode === FormMode.EDIT && formattedPassportExpiry && (
            <div className="w-full lg:w-[calc(50%_-_8px)]">
              <div className="flex p-2 px-4 items-start gap-4 self-stretch rounded bg-[#FFF2C5] dark:bg-[#453316] relative">
                <div>
                  <WarningIcon className="text-[#FF9800]" />
                </div>
                <p className="text-sm text-[#FF9800] leading-5 font-futura font-normal">
                  Your passport validity ends on {formattedPassportExpiry}
                </p>
              </div>
            </div>
          )}
          <div className="lg:hidden flex gap-3 justify-between sticky bottom-0 w-full  bg-white dark:bg-black py-5 px-2 md:px-5">
            <div className="w-[40%]" onClick={handleCancel}>
              <Button label="Cancel" className="!bg-transparent !text-Teal-500 border border-Teal-500 " />
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              data-save-button="true"
              label={
                loading
                  ? mode === FormMode.EDIT
                    ? 'Updating...'
                    : 'Saving...'
                  : mode === FormMode.EDIT
                    ? 'Update'
                    : 'Save'
              }
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmDialog} onClose={handleCancelConfirmDialog} title="Save Your Changes">
        <div className="space-y-6">
          <p className=" text-center text-lg text-Light leading-relaxed">
            You have unsaved changes to this passenger form. To continue navigation, you must either:
          </p>

          <div className="flex  gap-3 flex-col pt-3">
            <Button
              onClick={handleRevertAndLeave}
              className="bg-transparent dark:bg-transparent hover:!border-red-500 hover:!text-red-500 hover:!bg-transparent !text-Teal-500 !border !border-Teal-500"
            >
              Discard Changes
            </Button>
            <Button className="disabled:opacity-50" onClick={handleUpdateAndLeave} disabled={loading}>
              {loading ? 'Updating...' : 'Update & Continue'}
            </Button>
            <Button
              onClick={handleCancelConfirmDialog}
              className="bg-transparent dark:bg-transparent hover:!border-red-500 hover:!text-red-500 hover:!bg-transparent !text-Teal-500 !border !border-Teal-500"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const formatPassportExpiry = (value: string): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};

//* Helpers

const mapPassengerToForm = (p: Passenger) => ({
  name: p.name || '',
  nationality: p.nationality || '',
  gender: p.gender || '',
  date_of_birth: p.date_of_birth || '',
  relationship_with_user: p.relationship_with_user || '',
  mobile_number: p.mobile_number || '',
  email: p.email || '',
  passport_given_name: p.passport_given_name || '',
  passport_surname: p.passport_surname || '',
  passport_number: p.passport_number || '',
  passport_expiry: p.passport_expiry || '',
  passport_issuing_country: p.passport_issuing_country || '',
});

const mapFormToCreatePayload = (form: Record<string, string>): PassengerCreateRequest => ({
  name: form.name,
  nationality: form.nationality,
  gender: form.gender,
  date_of_birth: form.date_of_birth,
  relationship_with_user: form.relationship_with_user,
  mobile_number: form.mobile_number,
  email: form.email || null,
  passport_given_name: form.passport_given_name,
  passport_surname: form.passport_surname,
  passport_number: form.passport_number,
  passport_expiry: form.passport_expiry,
  passport_issuing_country: form.passport_issuing_country,
});

const mapFormToUpdatePayload = (form: Record<string, string>): PassengerUpdateRequest => ({
  name: form.name,
  nationality: form.nationality,
  gender: form.gender,
  date_of_birth: form.date_of_birth,
  relationship_with_user: form.relationship_with_user,
  mobile_number: form.mobile_number,
  email: form.email || null,
  passport_given_name: form.passport_given_name,
  passport_surname: form.passport_surname,
  passport_number: form.passport_number,
  passport_expiry: form.passport_expiry,
  passport_issuing_country: form.passport_issuing_country,
});

// Controlled ExpiryDate wrapper
interface ExpiryDatePickerControlledProps {
  value: string;
  onChange: (val: string) => void;
}

const ExpiryDatePickerControlled: React.FC<ExpiryDatePickerControlledProps> = ({ value, onChange }) => {
  const [val, setVal] = useState<string>(value);
  useEffect(() => setVal(value), [value]);

  return (
    <div>
      <ExpiryDatePicker
        onChange={(v) => {
          setVal(v);
          onChange(v);
        }}
        value={val}
      />
    </div>
  );
};
