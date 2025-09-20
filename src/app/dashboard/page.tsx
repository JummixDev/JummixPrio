

import { DashboardClient } from "./client";
import { collection, getDocs, limit, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define a serializable Event type for props
type SerializableEvent = {
  id: string;
  [key: string]: any;
  date: string; // Date will be a string
};


// Fetch initial events on the server
async function getUpcomingEvents(): Promise<SerializableEvent[]> {
  try {
    const q = query(collection(db, "events"), limit(4));
    const querySnapshot = await getDocs(q);
    const fetchedEvents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Manually serialize the Timestamp to an ISO string
        const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;
        return { 
            id: doc.id, 
            ...data,
            date: date,
        } as SerializableEvent;
    });
    return fetchedEvents;
  } catch (error) {
    console.error("Error fetching events on server:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <DashboardClient initialUpcomingEvents={upcomingEvents} />
  );
}
