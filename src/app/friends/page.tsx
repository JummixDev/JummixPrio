
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Check, UserCheck, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';

type UserProfile = {
    uid: string;
    displayName: string;
    username: string;
    photoURL: string;
    hint: string;
};

const FriendList = ({ users, type, onAction, currentUserData }: { users: UserProfile[], type: 'follower' | 'following' | 'suggestion', onAction: () => void, currentUserData: any }) => {
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    const handleFollow = async (targetUserUid: string) => {
        if (!currentUser) return;
        
        const currentUserRef = doc(db, "users", currentUser.uid);
        const targetUserRef = doc(db, "users", targetUserUid);

        await updateDoc(currentUserRef, { following: arrayUnion(targetUserUid) });
        await updateDoc(targetUserRef, { followers: arrayUnion(currentUser.uid) });

        toast({ title: 'Followed!', description: 'You are now following this user.' });
        onAction(); // Re-fetch data
    }
    
    const handleUnfollow = async (targetUserUid: string) => {
        if (!currentUser) return;

        const currentUserRef = doc(db, "users", currentUser.uid);
        const targetUserRef = doc(db, "users", targetUserUid);

        await updateDoc(currentUserRef, { following: arrayRemove(targetUserUid) });
        await updateDoc(targetUserRef, { followers: arrayRemove(currentUser.uid) });
        
        toast({ title: 'Unfollowed!', description: 'You are no longer following this user.' });
        onAction(); // Re-fetch data
    }

    const getButtonState = (userUid: string) => {
        const isFollowing = currentUserData?.following?.includes(userUid);
        if (type === 'follower') {
            return isFollowing ? (
                <Button variant="secondary" disabled><UserCheck /> Following</Button>
            ) : (
                <Button onClick={() => handleFollow(userUid)}><UserPlus /> Follow Back</Button>
            );
        }
        if (type === 'following') {
            return <Button variant="outline" onClick={() => handleUnfollow(userUid)}>Unfollow</Button>;
        }
        if (type === 'suggestion') {
            return <Button onClick={() => handleFollow(userUid)}><UserPlus /> Follow</Button>;
        }
        return null;
    }


    if (!users.length) {
        return <p className="text-muted-foreground text-center p-8">No users found.</p>;
    }

    return (
        <div className="space-y-4">
            {users.map(user => (
                <div key={user.uid} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                    <Link href={`/profile/${user.username}`} className='contents'>
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint={user.hint} />
                            <AvatarFallback>{user.displayName?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold">{user.displayName}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                    </Link>
                    <div className="ml-auto">
                        {getButtonState(user.uid)}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default function FriendsPage() {
    const { user, userData, loading: authLoading } = useAuth();
    const [followers, setFollowers] = useState<UserProfile[]>([]);
    const [following, setFollowing] = useState<UserProfile[]>([]);
    const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchData = async () => {
        if (!user || !userData) return;
        setLoading(true);

        try {
            // Fetch all users once
            const usersRef = collection(db, "users");
            const q = debouncedSearchTerm 
                ? query(usersRef, where('displayName', '>=', debouncedSearchTerm), where('displayName', '<=', debouncedSearchTerm + '\uf8ff'))
                : usersRef;
            const querySnapshot = await getDocs(q);
            const allUsers = querySnapshot.docs.map(doc => doc.data() as UserProfile & { followers?: string[], following?: string[] });

            const currentUserDoc = allUsers.find(u => u.uid === user.uid);
            const currentUserFollowing = currentUserDoc?.following || [];
            
            // Get profiles for followers
            const followerProfiles = allUsers.filter(u => currentUserDoc?.followers?.includes(u.uid));
            setFollowers(followerProfiles);

            // Get profiles for following
            const followingProfiles = allUsers.filter(u => currentUserFollowing.includes(u.uid));
            setFollowing(followingProfiles);
            
            // Suggestions: everyone the user is NOT following, and not the user themselves
            const suggestionProfiles = allUsers.filter(u => u.uid !== user.uid && !currentUserFollowing.includes(u.uid));
            setSuggestions(suggestionProfiles);

        } catch (error) {
            console.error("Error fetching friends data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [user, userData, authLoading, debouncedSearchTerm]);


    if (authLoading || loading) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Loading Friends...</h1>
            </div>
        )
    }

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-20 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-4">Friends</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <Card>
            <CardContent className="p-4">
                <Tabs defaultValue="suggestions">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <TabsList className="grid w-full sm:w-auto sm:grid-cols-3">
                            <TabsTrigger value="followers">Followers</TabsTrigger>
                            <TabsTrigger value="following">Following</TabsTrigger>
                            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                        </TabsList>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder="Search friends..." 
                                className="pl-10" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <TabsContent value="followers">
                                <FriendList users={followers} type="follower" onAction={fetchData} currentUserData={userData} />
                            </TabsContent>
                            <TabsContent value="following">
                                <FriendList users={following} type="following" onAction={fetchData} currentUserData={userData} />
                            </TabsContent>
                            <TabsContent value="suggestions">
                                <FriendList users={suggestions} type="suggestion" onAction={fetchData} currentUserData={userData} />
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
