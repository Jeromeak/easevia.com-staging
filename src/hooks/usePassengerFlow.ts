import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePassengerManagement } from '@/context/hooks/usePassengerManagement';
import type { SubscriptionPassenger } from '@/lib/types/api/subscription';

interface UsePassengerFlowReturn {
  // Navigation functions
  navigateToAddPassenger: (subscriptionId: string) => void;
  navigateToEditPassenger: (passengerId: string) => void;
  navigateToPassengersTab: () => void;
  navigateToSubscriptionTab: () => void;

  // Passenger management functions
  handlePassengerAdded: (passenger: SubscriptionPassenger, subscriptionId: string) => void;
  handlePassengerEdited: () => void;

  // Validation functions
  validatePassengerAddition: (
    subscriptionId: string,
    existingPassengers: SubscriptionPassenger[],
    memberCount: number
  ) => {
    canAdd: boolean;
    error?: string;
  };
}

export const usePassengerFlow = (): UsePassengerFlowReturn => {
  const router = useRouter();
  const { addPendingPassenger, canAddMorePassengers, openDetails, toggleDetails } = usePassengerManagement();

  // Navigation functions
  const navigateToAddPassenger = useCallback(
    (subscriptionId: string) => {
      router.push(`/my-account?tab=add&subscriptionId=${subscriptionId}`);
    },
    [router]
  );

  const navigateToEditPassenger = useCallback(
    (passengerId: string) => {
      router.push(`/my-account?tab=edit&id=${passengerId}`);
    },
    [router]
  );

  const navigateToPassengersTab = useCallback(() => {
    router.push('/my-account?tab=travellers');
  }, [router]);

  const navigateToSubscriptionTab = useCallback(
    (subscriptionId?: string) => {
      if (subscriptionId) {
        router.push(`/my-account?tab=subscription&subscriptionId=${subscriptionId}`);
      } else {
        router.push('/my-account?tab=subscription');
      }
    },
    [router]
  );

  // Passenger management functions
  const handlePassengerAdded = useCallback(
    (passenger: SubscriptionPassenger, subscriptionId: string) => {
      // Directly add passenger to pending list for the target subscription
      addPendingPassenger(subscriptionId, passenger);

      // Ensure the target subscription panel is expanded
      if (!openDetails[subscriptionId]) {
        toggleDetails(subscriptionId);
      }

      // Navigate back to subscription tab to show the update
      navigateToSubscriptionTab(subscriptionId);
    },
    [addPendingPassenger, openDetails, toggleDetails, navigateToSubscriptionTab]
  );

  const handlePassengerEdited = useCallback(() => {
    // Navigate to passengers tab after editing
    navigateToPassengersTab();
  }, [navigateToPassengersTab]);

  // Validation functions
  const validatePassengerAddition = useCallback(
    (subscriptionId: string, existingPassengers: SubscriptionPassenger[], memberCount: number) => {
      if (!canAddMorePassengers(subscriptionId, existingPassengers, memberCount)) {
        return {
          canAdd: false,
          error: `Cannot add more passengers. Maximum allowed: ${memberCount}`,
        };
      }

      return { canAdd: true };
    },
    [canAddMorePassengers]
  );

  return {
    navigateToAddPassenger,
    navigateToEditPassenger,
    navigateToPassengersTab,
    navigateToSubscriptionTab,
    handlePassengerAdded,
    handlePassengerEdited,
    validatePassengerAddition,
  };
};
