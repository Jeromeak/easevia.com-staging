import { ManagementTab } from '@/lib/types/common.types';

export const tabLabelMap: Record<ManagementTab, string> = {
  [ManagementTab.PROFILE]: 'My Profile',
  [ManagementTab.TRIPS]: 'My Trips',
  [ManagementTab.SUBSCRIPTION]: 'Subscription',
  [ManagementTab.TRAVELLERS]: 'Passengers',
  [ManagementTab.SUPPORT]: 'Support',
  [ManagementTab.ADD]: 'Add Traveller',
  [ManagementTab.EDIT]: 'Edit Traveller',
};

export type TabKey = keyof typeof tabLabelMap;
