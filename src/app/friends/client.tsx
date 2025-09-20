
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Check, UserCheck, Search, Loader2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import type { UserProfile } from './types';


const FriendList = ({ users, type, onAction, currentUserData }: { users: UserProfile[], type: 'follower' | 'following' | 'suggestion', onAction: (uid: string, action: 'follow' | 'unfollow') => void, currentUserData: any }) => {
    const { user: currentUser } = useAuth();

    const getButtonState = (user: UserProfile) => {
        if (!currentUserData) return null;
        const isFollowing = currentUserData.following?.includes(user.uid);
        
        if (type === 'follower') {
            return isFollowing ? (
                <Button variant="secondary" disabled><UserCheck className="mr-2" /> Following</Button>
            ) : (
                <Button onClick={() => onAction(user.uid, 'follow')}><UserPlus className="mr-2" /> Follow Back</Button>
            );
        }
        if (type === 'following') {
            return <Button variant="outline" onClick={() => onAction(user.uid, 'unfollow')}>Unfollow</Button>;
        }
        if (type === 'suggestion') {
             if (isFollowing) return null; // Should already be filtered, but as a safeguard
            return <Button onClick={() => onAction(user.uid, 'follow')}><UserPlus className="mr-2" /> Follow</Button>;
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
                        {getButtonState(user)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export function FriendsClient({ initialUsers }: { initialUsers: UserProfile[] }) {
    const { user, userData, loading: authLoading } = useAuth();
    const { toast } = useToast();
    
    const [allUsers, setAllUsers] = useState<UserProfile[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filters, setFilters] = useState({ verifiedOnly: false });
    const [sortBy, setSortBy] = useState('relevance');

    const handleAction = async (targetUserUid: string, action: 'follow' | 'unfollow') => {
        if (!user) return;
        
        const currentUserRef = doc(db, "users", user.uid);
        const targetUserRef = doc(db, "users", targetUserUid);

        try {
            if (action === 'follow') {
                await updateDoc(currentUserRef, { following: arrayUnion(targetUserUid) });
                await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
                toast({ title: 'Followed!', description: 'You are now following this user.' });
            } else { // unfollow
                await updateDoc(currentUserRef, { following: arrayRemove(targetUserUid) });
                await updateDoc(targetUserRef, { followers: arrayRemove(user.uid) });
                toast({ title: 'Unfollowed!', description: 'You are no longer following this user.' });
            }
        } catch(e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not perform action.' });
        }
    }

    const { followers, following, suggestions } = useMemo(() => {
        if (!user || !userData) return { followers: [], following: [], suggestions: [] };
        
        const currentUserFollowerUids = userData.followers || [];
        const currentUserFollowingUids = userData.following || [];

        const followerProfiles = allUsers.filter(u => currentUserFollowerUids.includes(u.uid));
        const followingProfiles = allUsers.filter(u => currentUserFollowingUids.includes(u.uid));
        
        const suggestionProfiles = allUsers.filter(u => {
            const isNotCurrentUser = u.uid !== user.uid;
            const isNotFollowed = !currentUserFollowingUids.includes(u.uid);
            const matchesSearch = debouncedSearchTerm
                ? u.displayName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || u.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                : true;
            const matchesFilters = filters.verifiedOnly ? u.isVerifiedHost : true;
            
            return isNotCurrentUser && isNotFollowed && matchesSearch && matchesFilters;
        });

        return { followers: followerProfiles, following: followingProfiles, suggestions: suggestionProfiles };
    }, [user, userData, allUsers, debouncedSearchTerm, filters]);


    if (authLoading) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Loading Friends...</h1>
            </div>
        )
    }

  return (
    <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-2">Find Friends</h1>
        <p className="text-muted-foreground mb-8">Connect with others, discover common interests and experiences.</p>
        <Card>
            <CardContent className="p-4">
                <Tabs defaultValue="suggestions">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <TabsList className="grid w-full sm:w-auto sm:grid-cols-3">
                            <TabsTrigger value="followers">Followers ({followers.length})</TabsTrigger>
                            <TabsTrigger value="following">Following ({following.length})</TabsTrigger>
                            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                        </TabsList>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Search friends..." 
                                    className="pl-10" 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                             <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <SlidersHorizontal />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Filter &amp; Sort</SheetTitle>
                                        <SheetDescription>
                                            Refine your search for new friends.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="py-4 space-y-6">
                                        <div className="space-y-4">
                                            <Label className="font-semibold">Sort by</Label>
                                            <RadioGroup value={sortBy} onValueChange={setSortBy}>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="relevance" id="s1" /><Label htmlFor="s1">Relevance</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="new" id="s2" /><Label htmlFor="s2">Newly Registered</Label></div>
                                                <div className="flex items-center space-x-2"><RadioGroupItem value="active" id="s3" /><Label htmlFor="s3">Most Active</Label></div>
                                            </RadioGroup>
                                        </div>
                                        <Separator/>
                                        <div className="space-y-4">
                                            <Label className="font-semibold">Filters</Label>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="verified-only" checked={filters.verifiedOnly} onCheckedChange={(checked) => setFilters(f => ({...f, verifiedOnly: !!checked}))} />
                                                <Label htmlFor="verified-only">Verified Hosts Only</Label>
                                            </div>
                                             <div className="flex items-center space-x-2">
                                                <Checkbox id="online-only" />
                                                <Label htmlFor="online-only">Online Now</Label>
                                            </div>
                                        </div>
                                        <Separator/>
                                        <div className="space-y-4">
                                            <Label className="font-semibold">Location</Label>
                                            <Input placeholder="e.g., San Francisco"/>
                                        </div>
                                    </div>
                                    <SheetClose asChild className="absolute bottom-4 right-4">
                                        <Button>Apply</Button>
                                    </SheetClose>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                    {authLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <TabsContent value="followers">
                                <FriendList users={followers} type="follower" onAction={handleAction} currentUserData={userData} />
                            </TabsContent>
                            <TabsContent value="following">
                                <FriendList users={following} type="following" onAction={handleAction} currentUserData={userData} />
                            </TabsContent>
                            <TabsContent value="suggestions">
                                <FriendList users={suggestions} type="suggestion" onAction={handleAction} currentUserData={userData} />
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </CardContent>
        </Card>
      </main>
  );
}

