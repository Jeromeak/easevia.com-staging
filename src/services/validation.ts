export const validatePassengerForm = (formData: Record<string, string>) => {
  const errors: Record<string, string> = {};

  //* Required field check
  if (!formData.name) errors.name = 'Name is required';
  if (!formData.nationality) errors.nationality = 'Nationality is required';
  if (!formData.gender) errors.gender = 'Gender is required';
  if (!formData.date_of_birth) errors.date_of_birth = 'Date of Birth is required';
  if (!formData.relationship_with_user) errors.relationship_with_user = 'Relationship is required';
  if (!formData.mobile_number) errors.mobile_number = 'Mobile number is required';
  if (!formData.email) errors.email = 'Email is required';
  if (!formData.passport_given_name) errors.passport_given_name = 'Given Name is required';
  if (!formData.passport_surname) errors.passport_surname = 'Surname is required';
  if (!formData.passport_number) errors.passport_number = 'Passport number is required';
  if (!formData.passport_expiry) errors.passport_expiry = 'Passport expiry date is required';
  if (!formData.passport_issuing_country) errors.passport_issuing_country = 'Issuing country is required';

  //* Mobile number format validation
  const phonePattern = /^\+([0-9]{1,3})\d{10}$/;

  if (formData.mobile_number && !phonePattern.test(formData.mobile_number)) {
    errors.mobile_number = 'Please enter a valid mobile number (e.g., +919876543210)';
  }

  //* Email format validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (formData.email && !emailPattern.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  //* Passport number format validation (if needed)
  const passportPattern = /^[A-Za-z0-9]+$/;

  if (formData.passport_number && !passportPattern.test(formData.passport_number)) {
    errors.passport_number = 'Passport number should only contain letters and numbers';
  }

  //* Passport expiry date validation (check if it's a valid date and not in the past)
  if (formData.passport_expiry && new Date(formData.passport_expiry) < new Date()) {
    errors.passport_expiry = 'Passport expiry date cannot be in the past';
  }

  return errors;
};
