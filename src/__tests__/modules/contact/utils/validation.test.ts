import { mockValidationRules } from '../__mocks__/env';

// Mock validation utility functions
export const validatePhoneNumber = (phone: string): boolean => {
  return mockValidationRules.PHONE_REGEX.test(phone);
};

export const validateEmail = (email: string): boolean => {
  // More strict email validation that rejects double dots and spaces but allows + symbols
  const emailRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email) && !email.includes('..') && !email.includes(' ');
};

export const validateName = (name: string): boolean => {
  return (
    name.trim().length >= mockValidationRules.MIN_NAME_LENGTH &&
    name.trim().length <= mockValidationRules.MAX_NAME_LENGTH
  );
};

export const validateSubject = (subject: string): boolean => {
  return (
    subject.trim().length >= mockValidationRules.MIN_SUBJECT_LENGTH &&
    subject.trim().length <= mockValidationRules.MAX_SUBJECT_LENGTH
  );
};

export const validateMessage = (message: string): boolean => {
  return (
    message.trim().length >= mockValidationRules.MIN_MESSAGE_LENGTH &&
    message.trim().length <= mockValidationRules.MAX_MESSAGE_LENGTH
  );
};

describe('Contact Form Validation Utils', () => {
  describe('validatePhoneNumber', () => {
    it('should validate phone numbers with +91 prefix', () => {
      expect(validatePhoneNumber('+919876543210')).toBe(true);
      expect(validatePhoneNumber('+911234567890')).toBe(true);
    });

    it('should validate phone numbers without +91 prefix', () => {
      expect(validatePhoneNumber('9876543210')).toBe(true);
      expect(validatePhoneNumber('1234567890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('123456789')).toBe(false); // 9 digits
      expect(validatePhoneNumber('12345678901')).toBe(false); // 11 digits
      expect(validatePhoneNumber('+91123456789')).toBe(false); // 9 digits with +91
      expect(validatePhoneNumber('+9112345678901')).toBe(false); // 11 digits with +91
      expect(validatePhoneNumber('abc1234567')).toBe(false); // contains letters
      expect(validatePhoneNumber('')).toBe(false); // empty
      expect(validatePhoneNumber('+9112345678a')).toBe(false); // contains letter
    });

    it('should handle edge cases', () => {
      expect(validatePhoneNumber('+91 9876543210')).toBe(false); // contains space
      expect(validatePhoneNumber('+91-9876543210')).toBe(false); // contains dash
      expect(validatePhoneNumber('+91.9876543210')).toBe(false); // contains dot
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
      expect(validateEmail('user123@test-domain.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false); // missing local part
      expect(validateEmail('user@')).toBe(false); // missing domain
      expect(validateEmail('user@.com')).toBe(false); // invalid domain
      expect(validateEmail('user..name@example.com')).toBe(false); // double dots
      expect(validateEmail('user@example..com')).toBe(false); // double dots in domain
      expect(validateEmail('')).toBe(false); // empty
      expect(validateEmail('user@')).toBe(false); // incomplete
    });

    it('should handle edge cases', () => {
      expect(validateEmail('user name@example.com')).toBe(false); // contains space
      expect(validateEmail('user@example com')).toBe(false); // contains space in domain
    });
  });

  describe('validateName', () => {
    it('should validate names within length limits', () => {
      expect(validateName('John')).toBe(true);
      expect(validateName('John Doe')).toBe(true);
      expect(validateName('A')).toBe(false); // too short
      expect(validateName('John Michael Smith Johnson')).toBe(true);
    });

    it('should reject names outside length limits', () => {
      expect(validateName('A')).toBe(false); // too short
      expect(validateName('')).toBe(false); // empty
      expect(validateName('A'.repeat(101))).toBe(false); // too long
    });

    it('should handle whitespace', () => {
      expect(validateName('  John  ')).toBe(true); // trimmed
      expect(validateName('   ')).toBe(false); // only whitespace
    });
  });

  describe('validateSubject', () => {
    it('should validate subjects within length limits', () => {
      expect(validateSubject('General Inquiry')).toBe(true);
      expect(validateSubject('Support Request')).toBe(true);
      expect(validateSubject('Test')).toBe(false); // too short
    });

    it('should reject subjects outside length limits', () => {
      expect(validateSubject('Test')).toBe(false); // too short
      expect(validateSubject('')).toBe(false); // empty
      expect(validateSubject('A'.repeat(201))).toBe(false); // too long
    });

    it('should handle whitespace', () => {
      expect(validateSubject('  General Inquiry  ')).toBe(true); // trimmed
      expect(validateSubject('   ')).toBe(false); // only whitespace
    });
  });

  describe('validateMessage', () => {
    it('should validate messages within length limits', () => {
      expect(validateMessage('This is a test message for the contact form.')).toBe(true);
      expect(validateMessage('I need help with my booking.')).toBe(true);
      expect(validateMessage('Help')).toBe(false); // too short
    });

    it('should reject messages outside length limits', () => {
      expect(validateMessage('Help')).toBe(false); // too short
      expect(validateMessage('')).toBe(false); // empty
      expect(validateMessage('A'.repeat(1001))).toBe(false); // too long
    });

    it('should handle whitespace', () => {
      expect(validateMessage('  This is a test message  ')).toBe(true); // trimmed
      expect(validateMessage('   ')).toBe(false); // only whitespace
    });
  });

  describe('Integration Tests', () => {
    it('should validate complete form data', () => {
      const validFormData = {
        name: 'John Doe',
        phone: '+919876543210',
        email: 'john@example.com',
        subject: 'General Inquiry',
        message: 'I would like to know more about your services.',
      };

      expect(validateName(validFormData.name)).toBe(true);
      expect(validatePhoneNumber(validFormData.phone)).toBe(true);
      expect(validateEmail(validFormData.email)).toBe(true);
      expect(validateSubject(validFormData.subject)).toBe(true);
      expect(validateMessage(validFormData.message)).toBe(true);
    });

    it('should reject invalid form data', () => {
      const invalidFormData = {
        name: 'A',
        phone: '123',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Help',
      };

      expect(validateName(invalidFormData.name)).toBe(false);
      expect(validatePhoneNumber(invalidFormData.phone)).toBe(false);
      expect(validateEmail(invalidFormData.email)).toBe(false);
      expect(validateSubject(invalidFormData.subject)).toBe(false);
      expect(validateMessage(invalidFormData.message)).toBe(false);
    });
  });
});
