import { useContext } from 'react';
import { PassengerManagementContext } from '../contexts/PassengerManagementContext';

export const usePassengerManagement = () => {
  const context = useContext(PassengerManagementContext);

  if (!context) {
    throw new Error('usePassengerManagement must be used within PassengerManagementProvider');
  }

  return context;
};
