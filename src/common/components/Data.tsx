import {
  FacebookIcon,
  Instagram,
  Linkedin,
  LogoutAccountIcon,
  MicrophoneIcon,
  MyTripsIcon,
  ProfileTabIcon,
  SubscriptionIcon,
  TravelersInfoIcon,
  Twitter,
  WhatsApp,
  AirFrance,
  AirIndia,
  BritishAirways,
  EmiratesIcon,
  EtihadIcon,
  FlyDubai,
  Lufthansa,
  QatarIcon,
  SingaporeAirline,
  TurikishAirline,
} from '@/icons/icon';

export interface TripInfo {
  icon: 'LocationIcon' | 'PlaneUpIcon';
  text: string;
}
export interface Plan {
  id: number;
  name: string;
  tag: string;
  description: string;
  price: string;
  location: string;
  flight: string;
  route: string;
  active?: string;
  benefits: string[];
}
export interface CountryOption {
  value: string;
  label: string;
}
export interface PlansData {
  plans: Plan[];
}

export interface MyAccountDataProps {
  id: number;
  label: string;
  icon: React.ReactNode;
}

export interface InputProps {
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
  iconPosition?: 'left' | 'right';
  maxLength?: number;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'decimal';
}

export interface TicketDataProps {
  id: string;
  user: string;
  subscription: string;
  booking_reference: string;
  passenger_details: {
    id: number;
    name: string;
    type: string;
    email: string;
    nationality: string;
    date_of_birth: string;
    passport_number: string;
    passport_issuing_country: string;
  }[];
  payment_details: {
    amount: number;
    currency: string;
    payment_status: string;
    transaction_id: string;
  };
  flight_details: {
    id: string;
    number: string;
    arrival: {
      at: string;
      iataCode: string;
      terminal: string;
    };
    aircraft: {
      code: string;
    };
    duration: string;
    departure: {
      at: string;
      iataCode: string;
      terminal: string;
    };
    operating: {
      carrierCode: string;
    };
    airlineName: string;
    carrierCode: string;
    numberOfStops: number;
    blacklistedInEU: boolean;
  }[];
  origin: string;
  destination: string;
  pnr_number: string;
  member_count: number;
  status: string;
  departure_date_time: string;
  arrival_date_time: string;
  booking_date: string;
  cancelation_date: string | null;
  created_at: string;
  updated_at: string;
}
export interface Traveller {
  name: string;
  shortName: string;
  gender: string;
  age: number;
  relation: string;
}

export interface AccountDropdownProps {
  id: number;
  label: string;
  icon: React.ReactNode;
  sub_title?: string;
  onclick?: () => void;
}

export interface TicketData {
  fromCity: string;
  fromCode: string;
  fromTime: string;
  toCity: string;
  toCode: string;
  toTime: string;
  date: string;
  duration: string;
  seatType: string;
  classType: string;
  airline: string;
  logo?: string;
}

export interface PartnersData {
  id: number;
  icon: React.ReactNode;
}

export interface DepartureTime {
  day: string;
  time: string;
}

export interface ClassDataProps {
  value: string;
  label: string;
}
export const AccountDropdownData: AccountDropdownProps[] = [
  {
    id: 1,
    label: 'My Profile',
    sub_title: 'Personal, Contact and Doc Mange',
    icon: <ProfileTabIcon width="24" height="24" />,
    onclick: () => {},
  },
  {
    id: 2,
    label: 'My Trips',
    sub_title: 'Manage your bookings',
    icon: <MyTripsIcon width="24" height="24" />,
    onclick: () => {},
  },
  {
    id: 3,
    label: 'Subscriptions Plan',
    sub_title: 'Update or mange your plans',
    icon: <SubscriptionIcon width="24" height="24" />,
    onclick: () => {},
  },
];
export const CountData = [
  {
    counts: '1500$',
    content: 'Total Flights Booked',
  },
  {
    counts: '5000$',
    content: 'Satisfied Customers',
  },
  {
    counts: '25000$',
    content: 'Happy Travelers',
  },
  {
    counts: '1200$',
    content: 'Flights Managed',
  },
];

export const MenuLinks = [
  {
    title: 'Home',
    link: '#home',
  },
  {
    title: 'Plans',
    link: '#plans',
  },
  {
    title: 'Contact',
    link: '#contact',
  },
];
export const SocialLinks = [
  {
    icon: <FacebookIcon />,
    link: 'https://www.facebook.com/',
    title: 'facebook',
  },
  {
    icon: <WhatsApp />,
    link: 'https://www.whatsapp.com/',
    title: 'whatsapp',
  },
  {
    icon: <Twitter />,
    link: 'https://x.com/?lang=en',
    title: 'twitter',
  },
  {
    icon: <Instagram />,
    link: 'https://www.instagram.com/',
    title: 'instagram',
  },
  {
    icon: <Linkedin />,
    link: 'https://www.linkedin.com/home',
    title: 'linkedin',
  },
];
export const steps: { title: string; desc: string }[] = [
  {
    title: 'Choose Your Plan',
    desc: 'Select a subscription that fits your travel frequency.',
  },
  {
    title: 'Earn Flight Credits',
    desc: 'Accumulate credits with each subscription payment..',
  },
  {
    title: 'Book Instantly',
    desc: 'Use your credits to book flights with ease',
  },
];

export const plansData: PlansData = {
  plans: [
    {
      id: 1,
      name: 'Basic',
      tag: 'Economy Class',
      description: 'Limited Destinations (e.g., Dubai to GCC, Dubai to India)',
      price: '$199',
      location: '1 to 2 trips/year',
      flight: 'Emirates, FlyDubai',
      route: 'Total routs 10',
      benefits: ['Basic booking features', 'Standard seat selection', 'Customer support (email only)'],
      active: '',
    },
    {
      id: 2,
      name: 'Premium',
      tag: 'Business Class',
      description: 'Regional & Popular Global Destinations (e.g., Dubai to Europe, Asia, North America)',
      price: '$499',
      location: '3 to 5 trips/year',
      flight: 'Emirates, Qatar Airways, Lufthansa',
      route: 'Total routs 10',
      benefits: ['Priority booking', 'Occasional upgrades', 'Limited access to offers and promotions'],
      active: 'true',
    },
    {
      id: 3,
      name: 'VIP',
      tag: 'Business/First Class',
      description: 'Global Destinations (e.g., Dubai to US, Australia, South America)',
      price: '$999',
      location: '6 to 10 trips/year',
      flight: 'Emirates, Etihad, Singapore Airlines, British Airways',
      route: 'Total routs 10',
      benefits: ['VIP lounges', 'Free upgrades', 'Priority check-in', 'Personalized customer support'],
      active: '',
    },
    {
      id: 4,
      name: 'Family',
      tag: 'Business/First Class',
      description: 'Global Destinations (e.g., Dubai to US, Australia, South America)',
      price: '$3999',
      location: '6 to 10 trips/year',
      flight: 'Emirates, Etihad, Singapore Airlines, British Airways',
      route: 'Total routs 10',
      benefits: ['Priority booking', 'Occasional upgrades', 'Limited access to offers and promotions'],
      active: '',
    },
    {
      id: 5,
      name: 'Corporate',
      tag: 'Business/First Class',
      description: 'Global Destinations (e.g., Dubai to US, Australia, South America)',
      price: '$3999',
      location: '6 to 10 trips/year',
      flight: 'Emirates, Etihad, Singapore Airlines, British Airways',
      route: 'Total routs 10',
      benefits: ['Priority booking', 'Occasional upgrades', 'Limited access to offers and promotions'],
      active: '',
    },
    {
      id: 6,
      name: 'Family',
      tag: 'Business/First Class',
      description: 'Global Destinations (e.g., Dubai to US, Australia, South America)',
      price: '$3999',
      location: '6 to 10 trips/year',
      flight: 'Emirates, Etihad, Singapore Airlines, British Airways',
      route: 'Total routs 10',
      benefits: ['Priority booking', 'Occasional upgrades', 'Limited access to offers and promotions'],
      active: '',
    },
  ],
};

export const ComparePlansData = [
  {
    plan: 'Basic',
    class: 'Economy Class',
    price: '$199',
  },
  {
    plan: 'Premium',
    class: 'Premium Economy',
    price: '$499',
  },
  {
    plan: 'VIP',
    class: 'Business Class',
    price: '$999',
  },
];

export const ComparePlansUIData = [
  {
    title: 'No. of Trips',
    basic: '1 to 2',
    premium: '3 to 5',
    vip: '5 to 10',
  },
  {
    title: 'No. of destination',
    basic: '4',
    premium: '8',
    vip: '16',
  },
  {
    title: 'No. of persons',
    basic: '1',
    premium: '4',
    vip: '9',
  },
  {
    title: 'Date change',
    basic: 'Upto 3 free',
    premium: 'Upto 3 free',
    vip: 'free',
  },
  {
    title: 'Class',
    basic: 'Economy',
    premium: 'Business',
    vip: 'First Class',
  },
  {
    title: 'Booking Leadtime',
    basic: 'before 48hrs',
    premium: 'before 48hrs',
    vip: 'before 24hrs',
  },
];
export const countryOptions: CountryOption[] = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
];

export const genderOptions: CountryOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const relationshipOptions: CountryOption[] = [
  { value: 'Self', label: 'Self' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Child', label: 'Child' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Other', label: 'Other' },
];

export const MyAccountData: MyAccountDataProps[] = [
  {
    id: 1,
    label: 'My Profile',
    icon: <ProfileTabIcon />,
  },
  {
    id: 2,
    label: 'Subscription',
    icon: <SubscriptionIcon />,
  },
  {
    id: 3,
    label: 'My Trips',
    icon: <MyTripsIcon />,
  },
  {
    id: 4,
    label: 'Passengers',
    icon: <TravelersInfoIcon />,
  },
  {
    id: 5,
    label: 'Support',
    icon: <MicrophoneIcon />,
  },
  {
    id: 6,
    label: 'Logout',
    icon: <LogoutAccountIcon />,
  },
];

export const headingMap: Record<string, string> = {
  'My Profile': 'My Profile',
  'My Trips': 'My Trips',
  Subscription: 'Subscription',
  'Travellers Info': 'Passengers',
  'Reset Password': 'Reset Password',
};

export const travellers: Traveller[] = [
  {
    name: 'James William',
    shortName: 'JM',
    gender: 'Male',
    age: 24,
    relation: 'Friend',
  },
  {
    name: 'Emily Stone',
    shortName: 'ES',
    gender: 'Female',
    age: 29,
    relation: 'Sister',
  },
  {
    name: 'Robert King',
    shortName: 'RK',
    gender: 'Male',
    age: 35,
    relation: 'Brother',
  },
  {
    name: 'Sophia Turner',
    shortName: 'ST',
    gender: 'Female',
    age: 22,
    relation: 'Cousin',
  },
  {
    name: 'Daniel Ray',
    shortName: 'DR',
    gender: 'Male',
    age: 40,
    relation: 'Uncle',
  },
];

export const BookingMenu = [
  {
    title: 'Home',
    link: '/',
  },
  {
    title: 'Plans',
    link: '/plans',
  },
  {
    title: 'Booking',
    link: '/booking',
  },
];

export const ticketData: TicketData[] = [
  {
    fromCity: 'Singapore',
    fromCode: 'SIN',
    fromTime: '12:30 AM',
    toCity: 'Tokyo',
    toCode: 'TYO',
    toTime: '06:00 PM',
    date: 'Sat, 17 Aug 24',
    duration: '18h 40m',
    seatType: 'Premium',
    classType: 'Economy Class',
    airline: 'Air Jamaica',
    logo: 'AirJamaica',
  },
  {
    fromCity: 'New York',
    fromCode: 'JFK',
    fromTime: '09:45 AM',
    toCity: 'London',
    toCode: 'LHR',
    toTime: '10:15 PM',
    date: 'Sun, 18 Aug 24',
    duration: '7h 30m',
    seatType: 'Premium',
    classType: 'Business Class',
    airline: 'Air Partner',
    logo: 'AirPartner',
  },
  {
    fromCity: 'Paris',
    fromCode: 'CDG',
    fromTime: '06:20 AM',
    toCity: 'Rome',
    toCode: 'FCO',
    toTime: '08:10 AM',
    date: 'Mon, 19 Aug 24',
    duration: '1h 50m',
    seatType: 'Basic',
    classType: 'Economy Class',
    airline: 'Air France',
    logo: 'AirFrance',
  },
  {
    fromCity: 'Dubai',
    fromCode: 'DXB',
    fromTime: '11:00 PM',
    toCity: 'Mumbai',
    toCode: 'BOM',
    toTime: '03:30 AM',
    date: 'Tue, 20 Aug 24',
    duration: '3h 00m',
    seatType: 'Premium',
    classType: 'First Class',
    airline: 'Emirates',
    logo: 'Emirates',
  },
  {
    fromCity: 'Berlin',
    fromCode: 'BER',
    fromTime: '01:10 PM',
    toCity: 'Amsterdam',
    toCode: 'AMS',
    toTime: '02:50 PM',
    date: 'Wed, 21 Aug 24',
    duration: '1h 40m',
    seatType: 'Basic',
    classType: 'Economy Class',
    airline: 'KLM',
    logo: 'KLM',
  },
  {
    fromCity: 'Sydney',
    fromCode: 'SYD',
    fromTime: '07:30 AM',
    toCity: 'Melbourne',
    toCode: 'MEL',
    toTime: '09:00 AM',
    date: 'Thu, 22 Aug 24',
    duration: '1h 30m',
    seatType: 'Premium',
    classType: 'Economy Class',
    airline: 'Qantas',
    logo: 'Qantas',
  },
  {
    fromCity: 'Los Angeles',
    fromCode: 'LAX',
    fromTime: '03:15 PM',
    toCity: 'San Francisco',
    toCode: 'SFO',
    toTime: '04:45 PM',
    date: 'Fri, 23 Aug 24',
    duration: '1h 30m',
    seatType: 'Basic',
    classType: 'Economy Class',
    airline: 'United Airlines',
    logo: 'United',
  },
  {
    fromCity: 'Toronto',
    fromCode: 'YYZ',
    fromTime: '10:00 AM',
    toCity: 'Vancouver',
    toCode: 'YVR',
    toTime: '12:30 PM',
    date: 'Sat, 24 Aug 24',
    duration: '2h 30m',
    seatType: 'Premium',
    classType: 'Business Class',
    airline: 'Air Canada',
    logo: 'AirCanada',
  },
  {
    fromCity: 'Bangkok',
    fromCode: 'BKK',
    fromTime: '08:40 PM',
    toCity: 'Singapore',
    toCode: 'SIN',
    toTime: '11:10 PM',
    date: 'Sun, 25 Aug 24',
    duration: '2h 30m',
    seatType: 'Premium',
    classType: 'Economy Class',
    airline: 'Singapore Airlines',
    logo: 'SingaporeAirlines',
  },
  {
    fromCity: 'Seoul',
    fromCode: 'ICN',
    fromTime: '05:00 AM',
    toCity: 'Tokyo',
    toCode: 'NRT',
    toTime: '07:30 AM',
    date: 'Mon, 26 Aug 24',
    duration: '2h 30m',
    seatType: 'Basic',
    classType: 'Economy Class',
    airline: 'Korean Air',
    logo: 'KoreanAir',
  },
];

export const PartnerData: PartnersData[] = [
  {
    id: 1,
    icon: <AirFrance />,
  },
  {
    id: 2,
    icon: <AirIndia />,
  },
  {
    id: 3,
    icon: <BritishAirways />,
  },
  {
    id: 4,
    icon: (
      <EmiratesIcon className="bg-[#D71A21] text-white dark:bg-[#151515] dark:hover:bg-[#D71A21] dark:text-white p-3" />
    ),
  },
  {
    id: 5,
    icon: <EtihadIcon />,
  },
  {
    id: 6,
    icon: <FlyDubai />,
  },
  {
    id: 7,
    icon: <Lufthansa />,
  },
  {
    id: 8,
    icon: <QatarIcon />,
  },
  {
    id: 9,
    icon: <SingaporeAirline />,
  },
  {
    id: 10,
    icon: <TurikishAirline />,
  },
];

export const BenefitsData = ['Priority booking', 'Occasional upgrades', 'Limited access to offers and promotions'];

export const faqData = [
  {
    question: 'Where can I find flight booking offers from Easeiva?',
    answer:
      'You can find the latest flight offers on our homepage and in our weekly email newsletters. Be sure to check our "Deals" section for exclusive promotions.',
  },
  {
    question: 'Are there any benefits to booking directly with Easeiva?',
    answer:
      'Yes! Booking directly with Easeiva gives you access to the lowest fares, flexible change policies, priority support, and exclusive discounts not available elsewhere.',
  },
  {
    question: 'How can I book a charter flight with Easeiva?',
    answer:
      'To book a charter flight, please fill out the request form on our Charter Services page or contact our customer support team for personalized assistance.',
  },
  {
    question: 'How will I be alerted about the next Easeiva sale?',
    answer:
      'Subscribe to our newsletter and enable notifications in your Easeiva account to get instant alerts about upcoming sales and special flight deals.',
  },
  {
    question: 'How do I reschedule or cancel my booking?',
    answer:
      'Log in to your Easeiva account, go to the "My Bookings" section, and choose the trip you want to modify. Options for rescheduling or cancellation will be provided based on your fare type.',
  },
  {
    question: 'Will I get a refund if I wish to cancel my booking?',
    answer:
      'Refund eligibility depends on the fare rules of your booking. Fully refundable tickets will be processed immediately, while non-refundable tickets may incur a fee or offer credit for future travel.',
  },
];

export const KeysData = [
  {
    total: '60',
    title: 'Domestic and Global Destinations',
  },
  {
    total: '10',
    title: 'Subscription Plans',
  },
  {
    total: '100',
    title: 'Happy Customers',
  },
  {
    total: '200',
    title: 'Fleet Strong',
  },
];

export const DepartureTime: DepartureTime[] = [
  {
    day: 'Night to Morning',
    time: '00.00 - 06.00',
  },
  {
    day: 'Morning to Noon',
    time: '06.00 - 12.00',
  },
  {
    day: 'Noon to Evening',
    time: '12.00 - 18.00',
  },
  {
    day: 'Evening to Night',
    time: '18.00 - 24.00',
  },
];

export const ClassData: ClassDataProps[] = [
  {
    value: 'Basic',
    label: 'Basic',
  },
  {
    value: 'Premium',
    label: 'Premium',
  },
  {
    value: 'Business',
    label: 'Business',
  },
  {
    value: 'First Class',
    label: 'First Class',
  },
];

export interface QucickSectionData {
  name: string;
  gender: string;
  seat: string;
}

export const QucickSectionData: QucickSectionData[] = [
  {
    name: 'James William',
    gender: 'Male',
    seat: 'E1234567G',
  },
  {
    name: 'Sarah johnson',
    gender: 'Female',
    seat: 'E1234568G',
  },
  {
    name: 'Michael chen',
    gender: 'Male',
    seat: 'E1234569G',
  },
  {
    name: 'David Anderson',
    gender: 'Male',
    seat: 'E1234562G',
  },
];

export const BookingSummaryData = [
  {
    departureDate: '18 Apr',
    arrivalDate: '19 Apr',
    departureTime: '06:45',
    arrivalTime: '10:00',
    from: { city: 'Singapore', code: 'SIN' },
    to: { city: 'Tokyo', code: 'TYO' },
    duration: '1h 50min',
    isDirect: true,
  },
  {
    departureDate: '24 Apr',
    arrivalDate: '24 Apr',
    departureTime: '13:20',
    arrivalTime: '10:00',
    from: { city: 'Tokyo', code: 'TYO' },
    to: { city: 'Singapore', code: 'SIN' },
    duration: '2h 10min',
    isDirect: true,
  },
];

export const bankOptions = [
  { label: 'Bank of America', value: 'boa' },
  { label: 'Chase', value: 'chase' },
  { label: 'Wells Fargo', value: 'wellsfargo' },
  { label: 'Citibank', value: 'citibank' },
];
