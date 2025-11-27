// Common messages used across the application
export const AUTH_MESSAGES = {
  EMAIL_VERIFY_TEXT: 'You need to verify your email id',
  MOBILE_VERIFY_TEXT: 'You need to verify your mobile number',
} as const;

export const FORM_MESSAGES = {
  ALL_FIELDS_REQUIRED: 'All fields are required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)',
  INVALID_USERNAME: 'Username cannot contain special characters. Only letters, numbers, and spaces are allowed.',
  USERNAME_TOO_LONG: 'Username cannot exceed 25 characters',
  EMAIL_TOO_LONG: 'Email cannot exceed 254 characters',
  MOBILE_TOO_LONG: 'Mobile number cannot exceed 17 characters',
} as const;

export const UI_MESSAGES = {
  LOADING: 'Sending...',
  NEXT: 'Next',
  ALREADY_HAVE_ACCOUNT: 'Already have an Easiva Account?',
  SIGN_IN_HERE: 'Sign in here.',
  OR: 'Or',
  CONTINUE_WITH_GOOGLE: 'Continue with Google',
  TERMS_AGREEMENT: 'By continuing you agree to our',
  TERMS_OF_SERVICE: 'Terms of Service',
  PRIVACY_POLICY: 'Privacy Policy',
} as const;
