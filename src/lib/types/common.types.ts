import type { Airport } from './api/booking';
import type { TicketData } from '@/common/components/Data';
import type { JSX } from 'react';
import type { FlightSearchResponse, FlightSearchParams } from './api/booking';

export enum TabType {
  EMAIL = 'email',
  MOBILE = 'mobile',
}
export enum TripType {
  ONEWAY = 'one-way',
  ROUND_TRIP = 'round-trip',
}

export enum PassengerType {
  ADULT = 'adult',
  CHILD = 'child',
  INFANT = 'infant',
}

export enum IconPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK = 'bank',
}

export enum FormMode {
  ADD = 'add',
  EDIT = 'edit',
}
export enum ModalType {
  LOGIN = 'login',
  OTP = 'otp',
  CREATE = 'create',
  VERIFY_EMAIL = 'verifyEmail',
  VERIFY_MOBILE = 'verifyMobile',
  CONTACT = 'contact',
  RESET_SUCCESS = 'resetSuccess',
  GOOGLE = 'google',
  SUCCESS = 'success',
}

export enum ManagementTab {
  PROFILE = 'profile',
  TRIPS = 'trips',
  SUBSCRIPTION = 'subscription',
  TRAVELLERS = 'travellers',
  SUPPORT = 'support',
  ADD = 'add',
  EDIT = 'edit',
}

export enum TripsTabType {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DestinationType {
  FROM = 'from',
  TO = 'to',
}

export enum MessageStatus {
  DELIVERED = 'delivered',
  SEEN = 'seen',
}

export interface DestinationDropDownProps {
  icon?: React.ComponentType<{ className?: string }>;
  value?: string;
  onChange: (airport: string) => void;
  preventList?: string[];
  className?: string;
  placeHolder?: string;
  iconPosition?: string;
  iconColor?: string;
  useCities?: boolean; // when true, populate from City API, onChange gives city id
  airports?: Airport[]; // Array of airports from subscription API
  type?: 'origin' | 'destination'; // Type of dropdown (origin or destination)
  postionClass?: string;
  WidthClass?: string;
}

export interface RecentSearch {
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  startDate: string;
  endDate: string;
  passengers?: number;
}

export interface Option {
  label: string;
  value: string;
}

export interface PackSelectProps {
  options: Option[];
  placeholder?: string;
  className?: string;
  mtClass?: string;
  leftIconWrapperClass?: string;
  thunderIconClass?: string;
  arrowWrapperClass?: string;
  onChange: (value: Option) => void;
}

export interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export interface TripFormProps {
  type: TripType;
  isEnabled: boolean;
  onToggle: () => void;
}

export interface OptionType {
  value: string;
  label: string;
}

export interface FormDataTypes {
  name: string;
  email: string;
  phone: string;
  address: string;
  country?: OptionType;
  city?: OptionType;
  state?: OptionType;
  pincode: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface FAQItemsProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export interface PartnerType {
  id: string | number;
  icon: React.ReactNode;
}

export interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message?: string;
  agree: boolean;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  agree?: string;
}

export interface MenuLink {
  title: string;
  link: string;
}

export interface SocialLink {
  icon: JSX.Element;
  link: string;
  title: string;
}

export interface FlightItemProps {
  flightName: string;
  flightTime: string;
  isOpen: boolean;
  onClick: () => void;
  isSelected: boolean;
  index: number;
}

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
  status?: MessageStatus;
}

export interface GifData {
  id: string;
  title: string;
  images: {
    fixed_height_small: {
      url: string;
    };
  };
}

export interface ChatboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userStatus?: string;
}

export interface PopularProps {
  textColor?: string;
  leftBgColor?: string;
  arrowColor?: string;
  arrowBorderColor?: string;
  widthClass?: string;
  subTitle?: string;
}

export interface PaymentProcessProps {
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ViewSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnableConfirm: (enabled: boolean) => void;
}

export interface FilterPannelProps {
  onClose?: () => void;
}

export interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  label?: string;
  className?: string;
}

export interface InputBoxProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
  required?: boolean;
  id?: string;
  subText?: string;
  autoComplete?: string;
  maxLength?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  className?: string;
}

export interface SocialLoginProps {
  onClick?: () => void;
  label: string;
  icon: React.ReactNode;
}

export interface TabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface ContactSupportProps {
  isContactSupportModal: boolean;
  onCloseContactSupport: () => void;
  onOpenOtpModal: () => void;
}

export interface CreateModalProps {
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  openSignInAccoount: () => void;
  openVerifyEmailModal: () => void;
  openGoogleVerifyModal: () => void;
}

export interface GoogleVerifyModalProps {
  isOpenGoogleVerify: boolean;
  onCloseGoogleVerify: () => void;
  openMobileVerifyModal: () => void;
  openSignInAccoount: () => void;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateAccount: () => void;
  onOpenOtpModal: (data: { input: string; tab: TabType }) => void;
  openGoogleVerfiyModal: () => void;
}

export interface OtpModalProps {
  OtpModalOpen: boolean;
  onOpenCreateAccount: () => void;
  onOtpModalClose: () => void;
  openGoogleVerifyModal: () => void;
  onOpenPhoneVerify?: () => void;
  onEdit: () => void;
  input: string;
  tab: TabType;
}

export interface ResetPasswordModalProps {
  isResetPasswordModalOpen: boolean;
  onCloseResetPasswordModal: () => void;
  openResetSuccess: () => void;
}

export interface ResetSuccessProps {
  isResetSuccessModalOpen: boolean;
  onCloseResetSuccessModal: () => void;
  onOpenLoginModal: () => void;
}

export interface successNodalProps {
  isSuccessModalOpen: boolean;
  onCloseSuccessModal: () => void;
}

export interface VerifyModalProps {
  isVerifyEmailModalOpen: boolean;
  onCloseVerifyEmailModal: () => void;
  openSignInAccount: () => void;
  openVerifyMobile: () => void;
}

export interface VerifyModalProps {
  isVerifyMobileModalOpen: boolean;
  onCloseVerifyMobileModal: () => void;
  openSignInAccoount: () => void;
  openSuccessModal: () => void;
  token?: string;
}

export interface CustomDatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
}

export interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface TicketCardProps extends TicketData {
  className?: string;
}

export interface HeroBannerProps {
  stepText: string;
  selectedCount?: number;
}

export interface PaymentProps {
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AddEditTravellerProps {
  setActiveTab: (tab: string) => void;
  mode: FormMode;
  passengerId?: string;
}

export interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

export interface CustomDatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
}

export interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

export interface TravellersTabProps {
  setActiveTab: (tab: string) => void;
}

export interface RaiseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SupportTabProps {
  setActiveTab: (tab: string) => void;
}

export interface TravellersTabProps {
  setActiveTab: (tab: string) => void;
}

export interface UserTabProps {
  progress?: number;
  activeTab?: string;
  setActiveTab: (tab: string) => void;
  children?: React.ReactNode;
  ptClass?: string;
}

export interface PlanCardProps {
  limit?: number;
  setSelectedPlans: (plans: number[]) => void;
}

export interface PlansButtonProps {
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface SubscriptionPlansProps {
  setSelectedPlans: (plans: number[]) => void;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FlightSearchBarProps {
  onSearch: () => void;
  subscriptions?: Option[];
  selectedSubscription?: Option | null;
  onSubscriptionSelect?: (option: Option) => void;
  baseSearchParams?: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    trip_type: string;
    subscription_id: string;
    adult: number;
    child?: number;
    infant?: number;
  } | null;
  onSearchResult?: (data: {
    outbound: FlightSearchResponse['outbound'];
    return?: FlightSearchResponse['return'];
    searchParams: FlightSearchParams;
  }) => void;
  onPerformSearch?: (searchParams: FlightSearchParams) => Promise<void>;
}

export interface LeftPannelProps {
  onclose?: () => void;
  disableModal?: boolean;
}

export interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSortChange?: (sortOption: string) => void;
}

export interface SortDataTypes {
  id: number;
  Label: string;
  subTitle: string;
}

export interface TripUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  initialType?: TripType;
  initialFrom?: string;
  initialTo?: string;
  initialDepartureDate?: string | null;
  initialReturnDate?: string | null;
}

export interface CustomCheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  className?: string;
  labelClassName?: string;
  onChange?: (checked: boolean) => void;
  toggle?: () => void;
  children?: React.ReactNode;
}

export interface FlightDurationSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
}

export interface Option {
  label: string;
  value: string;
  icon?: JSX.Element;
}

export interface CustomDropdownProps {
  options: Option[];
  placeholder?: string;
  onChange: (option: Option) => void;
  className?: string;
  value?: Option;
  bgColor?: string;
  labelColor?: string;
}
