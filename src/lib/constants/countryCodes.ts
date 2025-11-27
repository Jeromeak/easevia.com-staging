const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  india: 'IN',
  'republic of india': 'IN',
  ind: 'IN',
  'united states': 'US',
  usa: 'US',
  'united states of america': 'US',
  america: 'US',
  'united kingdom': 'GB',
  uk: 'GB',
  'great britain': 'GB',
  britain: 'GB',
  england: 'GB',
  canada: 'CA',
  australia: 'AU',
  germany: 'DE',
  france: 'FR',
  uae: 'AE',
  'united arab emirates': 'AE',
  singapore: 'SG',
};

const DEFAULT_COUNTRY_CODE = 'IN';

export const getCountryISOCode = (value?: string | null): string => {
  if (!value) {
    return DEFAULT_COUNTRY_CODE;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return DEFAULT_COUNTRY_CODE;
  }

  const upper = trimmed.toUpperCase();

  if (/^[A-Z]{2}$/.test(upper)) {
    return upper;
  }

  const normalized = trimmed.toLowerCase();

  return COUNTRY_NAME_TO_CODE[normalized] || DEFAULT_COUNTRY_CODE;
};
