'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProfileTab } from './ProfileTab';
import { TripsTab } from './TripsTab';
import { PlanTab } from './PlanTab';
import { SupportTab } from './SupportTab';
import { TravellersTab } from './TravellersTab';
import { AddEditTraveller } from './AddEditTraveller';
import { UserData } from './UserData';
import { FormMode, ManagementTab } from '@/lib/types/common.types';
import { useCallback, useMemo } from 'react';
import { PassengerManagementProvider } from '@/context/PassengerManagementContext';
import { useAuth } from '@/context/hooks/useAuth';
import type { UserProfile } from '@/lib/types/api/user';

export const tabLabelMap: Record<ManagementTab, string> = {
  [ManagementTab.PROFILE]: 'My Profile',
  [ManagementTab.TRIPS]: 'My Trips',
  [ManagementTab.SUBSCRIPTION]: 'Subscription',
  [ManagementTab.TRAVELLERS]: 'Passengers',
  [ManagementTab.SUPPORT]: 'Support',
  [ManagementTab.ADD]: 'Add Traveller',
  [ManagementTab.EDIT]: 'Edit Traveller',
};

type TabKey = keyof typeof tabLabelMap;

export const Management = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tabKey = (searchParams.get('tab') as TabKey) || 'profile';
  const activeTab = tabLabelMap[tabKey] || 'My Profile';

  const passengerIdParam = searchParams.get('id');
  const passengerId = passengerIdParam || undefined;

  // Calculate profile completion percentage
  const profileProgress = useMemo(() => {
    if (!user) return 0;

    const userProfile = user as UserProfile;
    const profileFields = [
      userProfile.name,
      userProfile.gender,
      userProfile.date_of_birth,
      userProfile.nationality,
      userProfile.address,
      userProfile.billing_address,
      userProfile.pincode,
      userProfile.country,
      userProfile.state,
      userProfile.city,
    ];

    const filledFields = profileFields.filter((field) => field && field.toString().trim() !== '').length;
    const totalFields = profileFields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);

    return percentage;
  }, [user]);

  const setActiveTab = useCallback(
    (newLabel: string) => {
      const entry = Object.entries(tabLabelMap).find(([, label]) => label === newLabel);

      if (entry) {
        router.push(`?tab=${entry[0]}`);
      }
    },
    [router]
  );

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'My Profile':
        return <ProfileTab />;
      case 'My Trips':
        return <TripsTab />;
      case 'Subscription':
        return <PlanTab setActiveTab={setActiveTab} />;
      case 'Passengers':
        return (
          <TravellersTab
            onAddPassenger={() => router.push(`?tab=add`)}
            onEditPassenger={(id: string) => router.push(`?tab=edit&id=${id}`)}
          />
        );
      case 'Support':
        return <SupportTab setActiveTab={setActiveTab} />;
      case 'Add Traveller':
        return <AddEditTraveller mode={FormMode.ADD} setActiveTab={setActiveTab} />;
      case 'Edit Traveller':
        return <AddEditTraveller mode={FormMode.EDIT} setActiveTab={setActiveTab} passengerId={passengerId} />;
      default:
        return null;
    }
  }, [activeTab, setActiveTab]);

  return (
    <PassengerManagementProvider>
      <section>
        <div className="lg:max-w-[90%] xl:max-w-[85%] mx-auto md:pt-20 lg:py-30">
          <div className="flex justify-between flex-wrap items-start w-full">
            <div className="w-full lg:w-[25%]">
              <UserData progress={profileProgress} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="w-full lg:w-[75%] flex flex-col">
              <div className="w-full">{renderContent}</div>
            </div>
          </div>
        </div>
      </section>
    </PassengerManagementProvider>
  );
};
