/**
 * Validates and enforces character limit for input fields
 * @param inputValue - The current value entered by the user
 * @param maxLength - The maximum character limit allowed for this field
 * @returns Object containing validation result and trimmed value
 */
export interface CharacterLimitResult {
  isValid: boolean;
  trimmedValue: string;
  remainingChars: number;
  exceedsLimit: boolean;
}

export const validateCharacterLimit = (inputValue: string, maxLength: number): CharacterLimitResult => {
  const trimmedValue = inputValue.slice(0, maxLength);
  const currentLength = inputValue.length;
  const exceedsLimit = currentLength > maxLength;
  const remainingChars = Math.max(0, maxLength - currentLength);

  return {
    isValid: !exceedsLimit,
    trimmedValue,
    remainingChars,
    exceedsLimit,
  };
};

/**
 * Enforces character limit by truncating input to maxLength
 * @param inputValue - The current value entered by the user
 * @param maxLength - The maximum character limit allowed for this field
 * @returns Truncated value that respects the character limit
 */
export const enforceCharacterLimit = (inputValue: string, maxLength: number): string => {
  return inputValue.slice(0, maxLength);
};

/**
 * Checks if input value exceeds the character limit
 * @param inputValue - The current value entered by the user
 * @param maxLength - The maximum character limit allowed for this field
 * @returns True if input exceeds limit, false otherwise
 */
export const exceedsCharacterLimit = (inputValue: string, maxLength: number): boolean => {
  return inputValue.length > maxLength;
};

/**
 * Validates and sanitizes mobile number input
 * - Only allows numbers and one + sign at the beginning
 * - Removes all other characters
 * - Ensures + is only at the beginning
 * @param inputValue - The current value entered by the user
 * @param maxLength - The maximum character limit allowed (default: 17)
 * @returns Sanitized mobile number string
 */
export const validateMobileNumber = (inputValue: string, maxLength = 17): string => {
  // Remove all characters except numbers and +
  let value = inputValue.replace(/[^0-9+]/g, '');

  // Ensure + is only at the beginning
  if (value.includes('+')) {
    const plusIndex = value.indexOf('+');

    if (plusIndex > 0) {
      // Remove + if it's not at the beginning
      value = value.replace(/\+/g, '');
    } else if (value.split('+').length > 2) {
      // If multiple + signs, keep only the first one
      value = '+' + value.replace(/\+/g, '');
    }
  }

  // Enforce character limit
  return enforceCharacterLimit(value, maxLength);
};

/**
 * Validates email format using regex
 * @param email - The email string to validate
 * @returns True if email format is valid, false otherwise
 */
export const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * Validates mobile number format using regex
 * - Must start with +
 * - First digit after + must be 1-9 (not 0)
 * - Followed by 9-15 more digits
 * - Total length: 11-17 characters (including +)
 * @param mobile - The mobile number string to validate
 * @returns True if mobile format is valid, false otherwise
 */
export const isValidMobileFormat = (mobile: string): boolean => {
  const mobileRegex = /^\+[1-9]\d{9,15}$/;

  return mobileRegex.test(mobile);
};

/**
 * Validates and sanitizes name input
 * - Only allows letters and spaces (no special characters, no numbers)
 * - Enforces character limit
 * @param inputValue - The current value entered by the user
 * @param maxLength - The maximum character limit allowed (default: 20)
 * @returns Sanitized name string
 */
export const validateName = (inputValue: string, maxLength = 20): string => {
  // Remove all characters except letters and spaces
  const value = inputValue.replace(/[^a-zA-Z\s]/g, '');

  // Enforce character limit
  return enforceCharacterLimit(value, maxLength);
};

/**
 * Validates and sanitizes pincode input
 * - Only allows numbers (no letters, no special characters)
 * - Enforces character limit
 * @param inputValue - The current value entered by the user
 * @param maxLength - The maximum character limit allowed (default: 11)
 * @returns Sanitized pincode string with only numbers
 */
export const validatePincode = (inputValue: string, maxLength = 11): string => {
  // Remove all characters except numbers
  const numericValue = inputValue.replace(/\D/g, '');

  // Enforce character limit
  return enforceCharacterLimit(numericValue, maxLength);
};
