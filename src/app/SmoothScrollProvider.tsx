'use client';

import { useSmoothScroll } from '@/hooks/smooth-scroll';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll();

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
