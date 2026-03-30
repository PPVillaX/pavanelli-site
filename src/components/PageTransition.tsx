'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function PageTransition() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof document === 'undefined' ||
      !('startViewTransition' in document)
    ) {
      return;
    }

    try {
      // Trigger a view transition on route change
      // The browser picks up ::view-transition-old/new CSS rules automatically
      (document as Document & { startViewTransition: (cb: () => void) => unknown }).startViewTransition(
        () => {}
      );
    } catch {
      // Safari or unsupported environment — silently ignore
    }
  }, [pathname]);

  return null;
}
