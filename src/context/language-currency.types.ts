import type React from 'react';
import { FranchFlagIcon, GermanFlagIcon, UsFlagIcon } from '@/icons/icon';

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'EN - English', icon: UsFlagIcon },
  { value: 'FR', label: 'FR - French', icon: FranchFlagIcon },
  { value: 'DE', label: 'DE - German', icon: GermanFlagIcon },
];

// Default values
export const DEFAULT_LANGUAGE = LANGUAGE_OPTIONS[0]; // English

export interface LanguageOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
