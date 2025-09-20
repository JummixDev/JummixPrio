

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, Loader2, SlidersHorizontal, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UserProfile } from './types';
import { useRouter } from 'next/navigation';

const UserCard = ({ user, onFollow }: { user: UserProfile, onFollow: (uid: string) => void }) => (
    <div className="text-center p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:-translate-y-1 border rounded-lg bg-card">
        <Link href={`/profile/${user.username}`} className="contents">
             <Avatar className="w-24 h-24 mb-4 border-2 border-primary/20">
                <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint={user.hint} />
                <AvatarFallback>{user.displayName?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold truncate w-full">{user.displayName}</p>
            <p className="text-sm text-muted-foreground w-full truncate">@{user.username}</p>
        </Link>
        <Button onClick={() => onFollow(user.uid)} className="mt-4 w-full">
            <UserPlus className="mr-2 h-4 w-4" /> Follow
        </Button>
    </div>
);


export function FriendsClient({ initialUsers }: { initialUsers: UserProfile[] }) {
    const { user, userData, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filters, setFilters] = useState({ verifiedOnly: false });
    const [sortBy, setSortBy] = useState('relevance');

     useEffect(() => {
        if (!authLoading && !user) {
        router.push('/');
        }
    }, [user, authLoading, router]);

    const handleFollow = async (targetUserUid: string) => {
        if (!user) return;
        
        const currentUserRef = doc(db, "users", user.uid);
        const targetUserRef = doc(db, "users", targetUserUid);

        try {
            await updateDoc(currentUserRef, { following: arrayUnion(targetUserUid) });
            await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
            toast({ title: 'Followed!', description: 'You are now following this user.' });
        } catch(e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not perform action.' });
        }
    }

    const filteredSuggestions = useMemo(() => {
        if (!user || !userData) return [];
        
        const currentUserFollowingUids = userData.following || [];
        
        return initialUsers.filter(u => {
            const isNotCurrentUser = u.uid !== user.uid;
            const isNotFollowed = !currentUserFollowingUids.includes(u.uid);
            const matchesSearch = debouncedSearchTerm
                ? u.displayName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || u.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                : true;
            const matchesFilters = filters.verifiedOnly ? u.isVerifiedHost : true;
            
            return isNotCurrentUser && isNotFollowed && matchesSearch && matchesFilters;
        });
    }, [user, userData, initialUsers, debouncedSearchTerm, filters]);


    if (authLoading || !user) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Loading Friends...</h1>
            </div>
        )
    }

  return (
    <div className="bg-secondary/20 min-h-screen">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">Discover Friends</h1>
              </div>
              <div className="flex gap-2 w-full sm:w-auto max-w-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name or username..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                    <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0">
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
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow pt-16 pb-24">
        {filteredSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredSuggestions.map(user => (
                    <UserCard key={user.uid} user={user} onFollow={handleFollow} />
                ))}
            </div>
        ) : (
             <div className="text-center py-20">
                <p className="text-muted-foreground">No suggestions found based on your criteria. Try adjusting your search or filters.</p>
            </div>
        )}
      </main>
    </div>
  );
}
