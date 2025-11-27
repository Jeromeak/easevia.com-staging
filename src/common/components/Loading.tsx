'use client';
import { useEffect, useState, useCallback, useRef } from 'react';

const RouteLoading = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const hasLoaded = useRef(false);
  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, []);

  const renderDot = useCallback(
    (i: number) => (
      <div
        key={i}
        className="w-3 h-3 bg-Teal-500 rounded-full animate-bounce"
        style={{
          animationDelay: `${i * 0.15}s`,
          animationDuration: '0.8s',
        }}
      />
    ),
    []
  );

  if (!loading) return null;

  return (
    <div className="fixed inset-0 h-screen z-[100000] top-0 !bg-white dark:!bg-black flex items-center justify-center">
      <div className="flex space-x-2">{[...Array(5)].map((_, i) => renderDot(i))}</div>
    </div>
  );
};

export default RouteLoading;
