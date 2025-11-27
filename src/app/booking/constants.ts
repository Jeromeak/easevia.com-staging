import { PassengerType } from '@/lib/types/common.types';

/**
 * Airport options organized by country
 * Used as fallback data when API airports are not available
 */
export const AIRPORT_OPTIONS_BY_COUNTRY: Record<
  string,
  {
    name: string;
    code: string;
    subtitle: string;
  }[]
> = {
  'Dubai, United Arab Emirates': [
    { name: 'Dubai International Airport', code: 'DXB', subtitle: 'Dubai International' },
    { name: 'Dubai Bus Station Airport', code: 'XNB', subtitle: '3 km from Dubai' },
    { name: 'Sharjah Airport', code: 'SHJ', subtitle: '17 km from Dubai' },
    { name: 'Dubai Al Maktoum Airport', code: 'DWC', subtitle: '45 km from Dubai' },
  ],
  Singapore: [{ name: 'Changi Airport', code: 'SIN', subtitle: 'Singapore International Airport' }],
  India: [
    { name: 'Mumbai Airport', code: 'BOM', subtitle: 'Chhatrapati Shivaji International Airport' },
    { name: 'New Delhi Airport', code: 'DEL', subtitle: 'Indira Gandhi International Airport' },
  ],
  'United States': [
    { name: 'John F. Kennedy International Airport', code: 'JFK', subtitle: 'New York' },
    { name: 'Los Angeles International Airport', code: 'LAX', subtitle: 'Los Angeles, California' },
    { name: "Chicago O'Hare International Airport", code: 'ORD', subtitle: 'Chicago, Illinois' },
  ],
  'United Kingdom': [
    { name: 'Heathrow Airport', code: 'LHR', subtitle: 'London' },
    { name: 'Gatwick Airport', code: 'LGW', subtitle: 'West Sussex, England' },
    { name: 'Manchester Airport', code: 'MAN', subtitle: 'Manchester, England' },
  ],
  Canada: [
    { name: 'Toronto Pearson International Airport', code: 'YYZ', subtitle: 'Toronto, Ontario' },
    { name: 'Vancouver International Airport', code: 'YVR', subtitle: 'Vancouver, British Columbia' },
    { name: 'Montréal-Trudeau International Airport', code: 'YUL', subtitle: 'Montréal, Québec' },
  ],
  Australia: [
    { name: 'Sydney Kingsford Smith Airport', code: 'SYD', subtitle: 'Sydney, New South Wales' },
    { name: 'Melbourne Airport', code: 'MEL', subtitle: 'Melbourne, Victoria' },
    { name: 'Brisbane Airport', code: 'BNE', subtitle: 'Brisbane, Queensland' },
  ],
  Germany: [
    { name: 'Frankfurt Airport', code: 'FRA', subtitle: 'Frankfurt am Main' },
    { name: 'Munich Airport', code: 'MUC', subtitle: 'Munich, Bavaria' },
    { name: 'Berlin Brandenburg Airport', code: 'BER', subtitle: 'Berlin' },
  ],
  Japan: [
    { name: 'Narita International Airport', code: 'NRT', subtitle: 'Tokyo (Narita)' },
    { name: 'Haneda Airport', code: 'HND', subtitle: 'Tokyo (Haneda)' },
    { name: 'Kansai International Airport', code: 'KIX', subtitle: 'Osaka' },
  ],
  France: [
    { name: 'Charles de Gaulle Airport', code: 'CDG', subtitle: 'Paris' },
    { name: 'Orly Airport', code: 'ORY', subtitle: 'Paris' },
    { name: "Nice Côte d'Azur Airport", code: 'NCE', subtitle: 'Nice' },
  ],
};

/**
 * Passenger type options for passenger selector
 */
export const PASSENGER_OPTIONS = [
  { label: 'Mature', sub: 'Ages 12+', key: PassengerType.ADULT },
  { label: 'Child', sub: 'Ages 2-11', key: PassengerType.CHILD },
  { label: 'Infant', sub: 'Ages Under 2', key: PassengerType.INFANT },
];

/**
 * Maximum number of passengers allowed
 */
export const PASSENGER_LIMIT = 9;
