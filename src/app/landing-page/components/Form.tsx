'use client';
import type { FormErrors, FormData } from '@/lib/types/common.types';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { submitContactUs, type ContactUsRequest } from '@/lib/api/contact';
import {
  validateName,
  validateMobileNumber,
  enforceCharacterLimit,
  isValidEmailFormat,
  isValidMobileFormat,
} from '@/utils/fieldValidation';

export const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    agree: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [checkboxKey, setCheckboxKey] = useState(0);

  // Auto-remove API error after 5 seconds
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [apiError]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
      agree: false,
    });
    setErrors({});
    setApiError('');
    setCheckboxKey((prev) => prev + 1);
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrors({});
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    // Apply validation based on field type
    let validatedValue: string | boolean = type === 'checkbox' ? target.checked : value;

    if (type !== 'checkbox') {
      // Name field: only letters and spaces, max 20 characters
      if (name === 'name') {
        validatedValue = validateName(value, 20);
      }
      // Phone field: validate format and limit to 17 characters
      else if (name === 'phone') {
        validatedValue = validateMobileNumber(value, 17);
      }
      // Email field: limit to 254 characters
      else if (name === 'email') {
        validatedValue = enforceCharacterLimit(value, 254);
      }
      // Subject field: limit to 256 characters
      else if (name === 'subject') {
        validatedValue = enforceCharacterLimit(value, 256);
      }
      // Message field: limit to 300 characters
      else if (name === 'message') {
        validatedValue = enforceCharacterLimit(value, 300);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: validatedValue,
    }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.length > 20) {
      newErrors.name = 'Name cannot exceed 20 characters.';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.length > 17) {
      newErrors.phone = 'Mobile number cannot exceed 17 characters.';
    } else if (!isValidMobileFormat(formData.phone)) {
      newErrors.phone = 'Please enter a valid mobile number with country code (e.g. +1234567890).';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (formData.email.length > 254) {
      newErrors.email = 'Email cannot exceed 254 characters.';
    } else if (!isValidEmailFormat(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    } else if (formData.subject.length > 256) {
      newErrors.subject = 'Subject cannot exceed 256 characters.';
    }

    // Message validation
    if (formData.message && formData.message.length > 300) {
      newErrors.message = 'Message cannot exceed 300 characters.';
    }

    // Agreement validation
    if (!formData.agree) newErrors.agree = 'You must agree before submitting.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setApiError('');

      if (validate()) {
        setIsSubmitting(true);

        try {
          const contactData: ContactUsRequest = {
            name: formData.name,
            phone_number: formData.phone,
            email: formData.email,
            subject: formData.subject,
            message: formData.message || '',
          };

          await submitContactUs(contactData);
          setShowSuccess(true);
        } catch (error) {
          console.error('Contact form submission error:', error);
          setApiError(error instanceof Error ? error.message : 'Failed to submit form. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [validate, formData]
  );

  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    if (showSuccess) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSuccess]);

  const sectionClassName = useMemo(
    () => clsx('dark:lg:bg-form_bg dark:bg-black bg-white bg-cover bg-center w-full h-full pb-16 xl:py-38'),
    []
  );
  const containerClassName = useMemo(() => clsx('max-w-[90%] xl:px-10 2xl:px-20 px-5 mx-auto'), []);
  const flexClassName = useMemo(() => clsx('flex justify-between w-full flex-wrap'), []);
  const leftColClassName = useMemo(
    () =>
      clsx(
        'lg:w-[30%] flex flex-col lg:mt-40 lg:ml-10 xl:ml-1 xl:mt-52 text-Teal-500 dark:text-orange-200 dark:xl:text-white'
      ),
    []
  );
  const connectClassName = useMemo(
    () => clsx('uppercase text-xl lg:text-4xl md:text-[36px] md:leading-[54px] font-[450] xl:leading-[30px]'),
    []
  );
  const withUsClassName = useMemo(
    () => clsx('text-[60px] xl:text-10xl md:text-[90px] md:leading-[90px] font-Neutra  uppercase xl:leading-[120px]'),
    []
  );
  const rightColClassName = useMemo(() => clsx('lg:w-[50%] 2xl:w-[40%] w-full mt-10'), []);
  const formClassName = useMemo(() => clsx('flex flex-col w-full'), []);
  const formFieldsClassName = useMemo(() => clsx('flex flex-col gap-10 xl:gap-[50px]'), []);
  const inputClassName = useMemo(
    () =>
      clsx(
        'w-full outline-none border-b dark:border-b-white border-b-secondary py-2 focus:border-Teal-500 duration-300 placeholder:text-neutral-300 dark:placeholder:text-white text-xl font-[450] uppercase tracking-[2.059px] placeholder:uppercase'
      ),
    []
  );
  const textareaClassName = inputClassName;
  const errorClassName = useMemo(() => clsx('text-red-500 text-sm mt-1'), []);
  const agreeRowClassName = useMemo(() => clsx('flex items-center gap-3 mt-6'), []);
  const agreeLabelClassName = useMemo(() => clsx('flex items-center gap-3 cursor-pointer select-none'), []);
  const agreeBoxClassName = useMemo(
    () => clsx('w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300'),
    []
  );
  const agreeInnerBoxClassName = useMemo(() => clsx('w-5 h-5 rounded-full transition-colors duration-500'), []);
  const agreeTextClassName = useMemo(
    () => clsx('text-sm xl:text-lg uppercase tracking-[1.081px] xl:leading-[21.621px]'),
    []
  );
  const agreeErrorClassName = useMemo(() => clsx('text-red-500 text-sm mt-2'), []);
  const submitRowClassName = useMemo(() => clsx('mt-8 xl:mt-10'), []);
  const submitBtnClassName = useMemo(
    () =>
      clsx(
        'uppercase rounded-[34.798px] text-orange-100 dark:text-white dark:xl:text-orange-200 dark:hover:text-black hover:text-black border cursor-pointer hover:bg-orange-200 duration-500 hover:border-transparent border-orange-100 dark:border-white dark:xl:border-orange-200 text-xl font-[450] leading-[15.649px] py-5 w-full md:w-fit xl:py-[27.026px] px-20'
      ),
    []
  );
  const successOverlayClassName = useMemo(
    () => clsx('fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50'),
    []
  );
  const successBoxClassName = useMemo(() => clsx('bg-white rounded-xl p-6 text-center w-[90%] max-w-md shadow-xl'), []);
  const successTitleClassName = useMemo(() => clsx('text-2xl font-bold text-green-600 mb-4'), []);
  const successTextClassName = useMemo(() => clsx('text-gray-700'), []);
  const closeBtnClassName = useMemo(
    () => clsx('mt-6 cursor-pointer px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition'),
    []
  );

  return (
    <section className={sectionClassName} id="contact">
      <div className={containerClassName}>
        <div className={flexClassName}>
          <div className={leftColClassName}>
            <div className={connectClassName}>Connect</div>
            <div className={withUsClassName}>with us</div>
          </div>
          <div className={rightColClassName}>
            <form onSubmit={handleSubmit} className={formClassName}>
              <div className={formFieldsClassName}>
                <div className="w-full">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className={inputClassName}
                    placeholder="Your Name"
                    maxLength={20}
                  />
                  {errors.name && <p className={errorClassName}>{errors.name}</p>}
                </div>
                <div className="w-full">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    className={inputClassName}
                    placeholder="Your Phone Number"
                    maxLength={17}
                  />
                  {errors.phone && <p className={errorClassName}>{errors.phone}</p>}
                </div>
                <div className="w-full">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className={inputClassName}
                    placeholder="Your Email Address"
                    maxLength={254}
                  />
                  {errors.email && <p className={errorClassName}>{errors.email}</p>}
                </div>
                <div className="w-full">
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    className="w-full outline-none border-b dark:border-b-white border-b-secondary py-2 focus:border-Teal-500 duration-300 placeholder:text-neutral-300 dark:placeholder:text-white text-xl font-[450] uppercase tracking-[2.059px] placeholder:uppercase"
                    placeholder="Subject"
                    maxLength={256}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div className="w-full">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={textareaClassName}
                    placeholder="Your Message"
                    maxLength={300}
                  ></textarea>
                  {errors.message && <p className={errorClassName}>{errors.message}</p>}
                </div>
              </div>
              <div className={agreeRowClassName}>
                <label className={agreeLabelClassName}>
                  <div>
                    <input
                      key={checkboxKey}
                      name="agree"
                      type="checkbox"
                      checked={formData.agree}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={clsx(agreeBoxClassName, formData.agree ? 'border-Teal-500' : 'border-gray-400')}>
                      <div
                        className={clsx(agreeInnerBoxClassName, formData.agree ? 'bg-Teal-500' : 'bg-transparent')}
                      />
                    </div>
                  </div>
                  <div className={agreeTextClassName}>
                    Do you agree to let us contact you as soon as we receive your message?
                  </div>
                </label>
              </div>
              {errors.agree && <p className={agreeErrorClassName}>{errors.agree}</p>}
              {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
              <div className={submitRowClassName}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={clsx(submitBtnClassName, isSubmitting && 'opacity-50 cursor-not-allowed')}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className={successOverlayClassName}>
          <div className={successBoxClassName}>
            <h2 className={successTitleClassName}>Thank you!</h2>
            <p className={successTextClassName}>Your message has been successfully submitted.</p>
            <button onClick={handleCloseSuccess} className={closeBtnClassName}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
