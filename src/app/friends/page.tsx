

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FriendsClient } from './client';
import type { UserProfile } from './types';


async function getUsers() {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        // Map and select only the fields needed by the client to avoid serialization errors
        // and to keep the data payload minimal.
        const fetchedUsers = querySnapshot.docs.map(doc => {
            const data = doc.data();
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
        return fetchedUsers;
    } catch (error) {
        console.error("Error fetching users on server:", error);
        return [];
    }
}

export default async function FriendsPage() {
    const users = await getUsers();
    return <FriendsClient initialUsers={users} />;
}

