
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This client component is now just a helper to redirect any old links
// to the new /explore page.
export function DashboardClient() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/explore');
  }, [router]);

  return null;
}
