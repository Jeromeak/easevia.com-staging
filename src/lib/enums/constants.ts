import type { Currency } from '@/lib/types/api/currency';

/**
 * Default USD currency object
 * Used as fallback when no access token is present or when currencies cannot be fetched
 */
export const DEFAULT_USD_CURRENCY: Currency = {
  id: '0',
  country: 'United States',
  currency_name: 'US Dollar',
  currency_symbol: '$',
  base_rate: '1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * List of airports displayed in the routes section
 */
export const AIRPORT_LIST: readonly string[] = [
  'Dubai, Dubai International Airport (DXB)',
  'Dubai, Al Maktoum International Airport (DWC)',
  'Singapore, Singapore Changi Airport (SIN)',
  'Malaysia, Kuala Lumpur International Airport (KUL)',
  'India, Chennai, Chennai International Airport (MAA)',
  'India, Kerala, Cochin International Airport (COK)',
  'India, Bengaluru, Kempegowda International Airport (BLR)',
  'India, Hyderabad, Rajiv Gandhi International Airport (HYD)',
  'China, Beijing, Beijing Capital International Airport (PEK)',
  'China, Shanghai, Shanghai Pudong International Airport (PVG)',
] as const;

/**
 * Route data interface for plan routes
 */
export interface RouteData {
  city: string;
  airport: string;
  code: string;
}

/**
 * Route data for plan cards displayed in the route modal
 */
export const PLAN_ROUTE_DATA: readonly RouteData[] = [
  { city: 'Dubai', airport: 'Dubai International Airport', code: 'DXB' },
  { city: 'Dubai', airport: 'Al Maktoum International Airport', code: 'DWC' },
  { city: 'Singapore', airport: 'Singapore Changi Airport', code: 'SIN' },
  { city: 'Malaysia', airport: 'Kuala Lumpur International Airport', code: 'KUL' },
  { city: 'India', airport: 'Mumbai Airport', code: 'BOM' },
  { city: 'India', airport: 'New Delhi Airport', code: 'DEL' },
  { city: 'India', airport: 'Bengaluru, Kempegowda International Airport', code: 'BLR' },
  { city: 'India', airport: 'Hyderabad, Rajiv Gandhi International Airport', code: 'HYD' },
  { city: 'China', airport: 'Beijing, Beijing Capital International Airport', code: 'PEK' },
  { city: 'China', airport: 'Shanghai, Shanghai Pudong International Airport', code: 'PVG' },
] as const;
