
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DashboardClient, Event } from './client';

// This is a server component, so we can fetch data directly
async function getUpcomingEvents(): Promise<Event[]> {
    try {
        const q = query(
            collection(db, "events"), 
            where("date", ">=", new Date().toISOString().split('T')[0]),
            orderBy("date", "asc"),
            limit(9)
        );
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Important: Convert Firestore Timestamp to a serializable format (ISO string)
            return {
                ...data,
                id: doc.id,
                date: data.date.toString(), // Convert to string
            } as Event;
        });
        return events;
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        return [];
    }
}


export default async function DashboardPage() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <DashboardClient initialUpcomingEvents={upcomingEvents} />
  );
}
