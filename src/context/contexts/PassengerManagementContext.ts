import { createContext } from 'react';
import type { SubscriptionPassenger } from '@/lib/types/api/subscription';

interface PassengerManagementState {
  pendingPassengers: { [planId: string]: SubscriptionPassenger[] };
  planErrors: { [planId: string]: string | null };
  openDetails: { [key: string]: boolean };
  openDropdowns: { [planId: string]: boolean };
  selectedPassengers: { [planId: string]: SubscriptionPassenger | null };
}

export interface PassengerManagementContextType extends PassengerManagementState {
  // State setters
  setPendingPassengers: (planId: string, passengers: SubscriptionPassenger[]) => void;
  addPendingPassenger: (planId: string, passenger: SubscriptionPassenger) => void;
  removePendingPassenger: (planId: string, passengerId: string) => void;
  clearPendingPassengers: (planId: string) => void;

  // Error management
  setPlanError: (planId: string, error: string | null) => void;
  clearPlanError: (planId: string) => void;
  clearAllPlanErrors: () => void;

  // UI state management
  toggleDetails: (planId: string) => void;
  setOpenDropdowns: (planId: string, isOpen: boolean) => void;
  setSelectedPassenger: (planId: string, passenger: SubscriptionPassenger | null) => void;

  // Utility functions
  getTotalPassengerCount: (planId: string, existingPassengers: SubscriptionPassenger[]) => number;
  canAddMorePassengers: (planId: string, existingPassengers: SubscriptionPassenger[], memberCount: number) => boolean;

  // Reset state
  resetState: () => void;
}

export const PassengerManagementContext = createContext<PassengerManagementContextType | undefined>(undefined);
