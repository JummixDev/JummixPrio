

import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ExploreClient } from './client';
import type { Event, UserProfile } from './types';


async function getEvents() {
    try {
        const q = query(collection(db, "events"));
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
        // Shuffle events once on the server
        return fetchedEvents.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error("Error fetching events on server:", error);
        return [];
    }
}

async function getUsers() {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        return querySnapshot.docs.map(doc => ({ uid: doc.id, ...(doc.data() as Omit<UserProfile, 'uid'>) }));
    } catch (error) {
        console.error("Error fetching users on server:", error);
        return [];
    }
}

export default async function ExplorePage() {
    const events = await getEvents();
    const users = await getUsers();

    return <ExploreClient initialEvents={events} initialUsers={users} />;
}
