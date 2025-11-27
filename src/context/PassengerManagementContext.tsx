'use client';

import React, { useState, useCallback, useRef } from 'react';
import type { SubscriptionPassenger } from '@/lib/types/api/subscription';
import { PassengerManagementContext } from './contexts/PassengerManagementContext';
import type { PassengerManagementContextType } from './contexts/PassengerManagementContext';

interface PassengerManagementState {
  pendingPassengers: { [planId: string]: SubscriptionPassenger[] };
  planErrors: { [planId: string]: string | null };
  openDetails: { [key: string]: boolean };
  openDropdowns: { [planId: string]: boolean };
  selectedPassengers: { [planId: string]: SubscriptionPassenger | null };
}

export const PassengerManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PassengerManagementState>({
    pendingPassengers: {},
    planErrors: {},
    openDetails: {},
    openDropdowns: {},
    selectedPassengers: {},
  });

  const errorTimeoutsRef = useRef<{ [planId: string]: NodeJS.Timeout }>({});

  // State setters
  const setPendingPassengers = useCallback((planId: string, passengers: SubscriptionPassenger[]) => {
    setState((prev) => ({
      ...prev,
      pendingPassengers: { ...prev.pendingPassengers, [planId]: passengers },
    }));
  }, []);

  const addPendingPassenger = useCallback((planId: string, passenger: SubscriptionPassenger) => {
    setState((prev) => ({
      ...prev,
      pendingPassengers: {
        ...prev.pendingPassengers,
        [planId]: [...(prev.pendingPassengers[planId] || []), passenger],
      },
    }));
  }, []);

  const removePendingPassenger = useCallback((planId: string, passengerId: string) => {
    setState((prev) => ({
      ...prev,
      pendingPassengers: {
        ...prev.pendingPassengers,
        [planId]: (prev.pendingPassengers[planId] || []).filter((p) => p.id !== passengerId),
      },
    }));
  }, []);

  const clearPendingPassengers = useCallback((planId: string) => {
    setState((prev) => ({
      ...prev,
      pendingPassengers: { ...prev.pendingPassengers, [planId]: [] },
    }));
  }, []);

  // Error management with auto-clear
  const setPlanError = useCallback((planId: string, error: string | null) => {
    // Clear existing timeout for this plan
    if (errorTimeoutsRef.current[planId]) {
      clearTimeout(errorTimeoutsRef.current[planId]);
    }

    setState((prev) => ({
      ...prev,
      planErrors: { ...prev.planErrors, [planId]: error },
    }));

    // Auto-clear error after 5 seconds if it's not null
    if (error) {
      errorTimeoutsRef.current[planId] = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          planErrors: { ...prev.planErrors, [planId]: null },
        }));
      }, 5000);
    }
  }, []);

  const clearPlanError = useCallback((planId: string) => {
    if (errorTimeoutsRef.current[planId]) {
      clearTimeout(errorTimeoutsRef.current[planId]);
    }

    setState((prev) => ({
      ...prev,
      planErrors: { ...prev.planErrors, [planId]: null },
    }));
  }, []);

  const clearAllPlanErrors = useCallback(() => {
    // Clear all timeouts
    Object.values(errorTimeoutsRef.current).forEach((timeout) => clearTimeout(timeout));
    setState((prev) => ({
      ...prev,
      planErrors: {},
    }));
  }, []);

  // UI state management
  const toggleDetails = useCallback((planId: string) => {
    setState((prev) => ({
      ...prev,
      openDetails: { ...prev.openDetails, [planId]: !prev.openDetails[planId] },
    }));
  }, []);

  const setOpenDropdowns = useCallback((planId: string, isOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      openDropdowns: { ...prev.openDropdowns, [planId]: isOpen },
    }));
  }, []);

  const setSelectedPassenger = useCallback((planId: string, passenger: SubscriptionPassenger | null) => {
    setState((prev) => ({
      ...prev,
      selectedPassengers: { ...prev.selectedPassengers, [planId]: passenger },
    }));
  }, []);

  // Utility functions
  const getTotalPassengerCount = useCallback(
    (planId: string, existingPassengers: SubscriptionPassenger[]) => {
      const pendingCount = (state.pendingPassengers[planId] || []).length;

      return existingPassengers.length + pendingCount;
    },
    [state.pendingPassengers]
  );

  const canAddMorePassengers = useCallback(
    (planId: string, existingPassengers: SubscriptionPassenger[], memberCount: number) => {
      const totalCount = getTotalPassengerCount(planId, existingPassengers);

      return totalCount < memberCount;
    },
    [getTotalPassengerCount]
  );

  // Reset state
  const resetState = useCallback(() => {
    // Clear all timeouts
    Object.values(errorTimeoutsRef.current).forEach((timeout) => clearTimeout(timeout));
    setState({
      pendingPassengers: {},
      planErrors: {},
      openDetails: {},
      openDropdowns: {},
      selectedPassengers: {},
    });
  }, []);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      Object.values(errorTimeoutsRef.current).forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const contextValue: PassengerManagementContextType = {
    ...state,
    setPendingPassengers,
    addPendingPassenger,
    removePendingPassenger,
    clearPendingPassengers,
    setPlanError,
    clearPlanError,
    clearAllPlanErrors,
    toggleDetails,
    setOpenDropdowns,
    setSelectedPassenger,
    getTotalPassengerCount,
    canAddMorePassengers,
    resetState,
  };

  return <PassengerManagementContext.Provider value={contextValue}>{children}</PassengerManagementContext.Provider>;
};
