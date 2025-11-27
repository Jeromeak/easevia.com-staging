'use client';
import { useCheckout } from '@/context/hooks/useCheckout';

export const ValidationErrors = () => {
  const { state } = useCheckout();
  const { validationErrors } = state;

  if (validationErrors.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
      {validationErrors.map((error, index) => (
        <div key={`error-${index}-${error.slice(0, 20)}`} className="text-red-400 text-sm">
          ⚠ {error}
        </div>
      ))}
    </div>
  );
};
