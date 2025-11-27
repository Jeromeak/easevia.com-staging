import { useContext } from 'react';
import { AuthFlowContext } from '../contexts/AuthFlowContext';

export const useAuthFlow = () => {
  const context = useContext(AuthFlowContext);
  if (!context) throw new Error('useAuthFlow must be used within AuthFlowProvider');

  return context;
};
