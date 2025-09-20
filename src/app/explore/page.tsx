
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ExploreClient } from './client';
import type { Event, UserProfile } from './types';


async function getEvents(): Promise<Event[]> {
    try {
        const q = query(collection(db, "events"));
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id,
                ...data,
                // Ensure date is a plain string for serialization
                date: data.date.toString(),
            } as Event
        });
        // Shuffle events once on the server
        return fetchedEvents.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error("Error fetching events on server:", error);
        return [];
    }
}

async function getUsers(): Promise<UserProfile[]> {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Select only the fields needed by the client to avoid serialization errors
            return {
                uid: doc.id,
                displayName: data.displayName || '',
                username: data.username || '',
                photoURL: data.photoURL || '',
                hint: data.hint || 'person portrait',
                followers: data.followers || [],
                following: data.following || [],
                isVerifiedHost: data.isVerifiedHost || false,
            };
        });
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

