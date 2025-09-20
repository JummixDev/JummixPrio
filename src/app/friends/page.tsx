

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FriendsClient } from './client';
import type { UserProfile } from './types';


async function getUsers() {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const fetchedUsers = querySnapshot.docs.map(doc => ({ uid: doc.id, ...(doc.data() as Omit<UserProfile, 'uid'>) }));
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
