

import { redirect } from 'next/navigation';

// The dashboard page is now obsolete and redirects to the new /explore page.
export default function DashboardPage() {
  redirect('/explore');
}
