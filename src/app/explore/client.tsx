
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, Loader2, Users, ArrowRight, MessageSquare, UserPlus, Check, UserCheck, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { ChatList } from '@/components/jummix/ChatList';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useDebounce } from '@/hooks/use-debounce';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Event, UserProfile, SortOption, DateFilter } from './types';


const aspectRatios = ['aspect-square', 'aspect-[4/3]', 'aspect-[3/4]'];
const EventTile = ({ event, index }: { event: Event, index: number }) => (
    <div className="mb-4 break-inside-avoid">
         <Link 
            href={`/event/${event.id}`} 
            className={cn(
                "block group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out",
                "hover:shadow-lg hover:ring-2 hover:ring-primary hover:scale-105"
            )}
        >
            <Image 
                src={event.image || 'https://picsum.photos/seed/default-event/600/400'} 
                alt={event.name || 'Event image'}
                width={400}
                height={400}
                className={cn("w-full h-auto object-cover", aspectRatios[index % aspectRatios.length])}
                data-ai-hint={event.hint || 'event photo'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="font-bold truncate">{event.name}</h3>
                <p className="text-sm">{event.location}</p>
            </div>
        </Link>
    </div>
)

const UserCard = ({ user, onFollow }: { user: UserProfile, onFollow: (uid: string) => void }) => (
    <div className="text-center p-6 flex flex-col items-center justify-center transition-all hover:shadow-lg hover:-translate-y-1 border rounded-lg">
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



export function ExploreClient({ initialEvents, initialUsers }: { initialEvents: Event[], initialUsers: UserProfile[] }) {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [priceFilter, setPriceFilter] = useState({ free: false, paid: false });
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [view, setView] = useState<'explore' | 'friends' | 'chats'>('explore');

  const { user, userData, loading } = useAuth();
  const [allUsers, setAllUsers] = useState<UserProfile[]>(initialUsers);
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const debouncedFriendSearchTerm = useDebounce(friendSearchTerm, 300);
  const [friendFilters, setFriendFilters] = useState({ verifiedOnly: false });
  const [friendSortBy, setFriendSortBy] = useState('relevance');
  const { toast } = useToast();
  const router = useRouter();
  
    useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...initialEvents];

    if (priceFilter.free && !priceFilter.paid) {
      filtered = filtered.filter(event => event.isFree);
    } else if (!priceFilter.free && priceFilter.paid) {
      filtered = filtered.filter(event => !event.isFree);
    }

    const today = new Date();
    if (dateFilter === 'today') {
       filtered = filtered.filter(event => new Date(event.date).toDateString() === today.toDateString());
    }

    if (sortBy !== 'relevance') {
        switch (sortBy) {
        case 'date_asc':
            filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            break;
        case 'date_desc':
        case 'newest':
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            break;
        case 'popularity':
            filtered.sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0));
            break;
        case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
        }
    }


    return filtered;
  }, [sortBy, priceFilter, dateFilter, initialEvents]);
  
    const filteredSuggestions = useMemo(() => {
        if (!user || allUsers.length === 0) return [];
        const currentUserFollowing = Array.isArray(userData?.following) ? userData.following : [];
        return allUsers.filter(u => {
            const isNotCurrentUser = u.uid !== user.uid;
            const isNotFollowed = !currentUserFollowing.includes(u.uid);
            const matchesSearch = debouncedFriendSearchTerm
                ? u.displayName.toLowerCase().includes(debouncedFriendSearchTerm.toLowerCase()) || u.username.toLowerCase().includes(debouncedFriendSearchTerm.toLowerCase())
                : true;
            const matchesFilters = friendFilters.verifiedOnly ? u.isVerifiedHost : true;
            return isNotCurrentUser && isNotFollowed && matchesSearch && matchesFilters;
        });
    }, [user, allUsers, userData, debouncedFriendSearchTerm, friendFilters]);


  const handlePriceChange = (filter: 'free' | 'paid') => {
    setPriceFilter(prev => ({ ...prev, [filter]: !prev[filter] }));
  }

 const handleBackClick = () => {
    if (view === 'chats') {
        setView('friends');
    } else if (view === 'friends') {
        setView('explore');
    }
 };
 
 const handleFollow = async (targetUserUid: string) => {
    if (!user || !targetUserUid) return;
    
    const currentUserRef = doc(db, "users", user.uid);
    const targetUserRef = doc(db, "users", targetUserUid);

    await updateDoc(currentUserRef, { following: arrayUnion(targetUserUid) });
    await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });

    toast({ title: 'Followed!', description: 'You are now following this user.' });
    // This is a client-side update for immediate feedback
    setAllUsers(prev => prev.map(u => {
      if (u.uid === user.uid) {
        return { ...u, following: [...(u.following || []), targetUserUid] };
      }
      if (u.uid === targetUserUid) {
        return { ...u, followers: [...(u.followers || []), user.uid] };
      }
      return u;
    }));
}


  if (loading || !user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold font-headline text-primary">Loading your Jummix experience</h1>
        </div>
    );
  }

  return (
    <div className="bg-secondary/20 min-h-screen flex flex-col">
       <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow overflow-hidden pt-24 h-full flex flex-col">
            <div className={cn("transition-transform duration-500 ease-in-out h-full", {
                'translate-x-0': view === 'explore',
                '-translate-x-[110%]': view === 'friends' || view === 'chats',
            })}>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-3xl font-bold font-headline mb-2 text-center sm:text-left">Discover Events</h1>
                        <p className="text-muted-foreground text-center sm:text-left">Find your next great experience from our curated list of events.</p>
                    </div>
                     <div className="flex flex-col gap-2 items-center sm:items-end">
                         {(userData?.isVerifiedHost || userData?.email === 'service@jummix.com') && (
                            <Button asChild>
                                <Link href="/host/create-event">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Event
                                </Link>
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">
                                    <SlidersHorizontal className="mr-0 sm:mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Filters</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="flex flex-col">
                                <SheetHeader>
                                    <SheetTitle>Filter & Sort Events</SheetTitle>
                                    <SheetDescription>
                                        Refine your search to find the perfect event.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="py-4 space-y-6 overflow-y-auto flex-grow pr-6">
                                    {/* Sort by */}
                                    <div className="space-y-4">
                                        <Label className="font-semibold">Sort by</Label>
                                        <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="relevance" id="s1" /><Label htmlFor="s1">Relevance</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="newest" id="s2" /><Label htmlFor="s2">Newest First</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="popularity" id="s3" /><Label htmlFor="s3">Popularity</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="rating" id="s4" /><Label htmlFor="s4">Best Rating</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="distance" id="s5" /><Label htmlFor="s5">Distance</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="date_asc" id="s6" /><Label htmlFor="s6">Date (Ascending)</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="date_desc" id="s7" /><Label htmlFor="s7">Date (Descending)</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="price_asc" id="s8" /><Label htmlFor="s8">Price (Ascending)</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="price_desc" id="s9" /><Label htmlFor="s9">Price (Descending)</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <Separator />
                                    {/* Date */}
                                    <div className="space-y-4">
                                        <Label className="font-semibold">Date</Label>
                                        <RadioGroup value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="d1" /><Label htmlFor="d1">Anytime</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="today" id="d2" /><Label htmlFor="d2">Today</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="weekend" id="d3" /><Label htmlFor="d3">This Weekend</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="month" id="d4" /><Label htmlFor="d4">This Month</Label></div>
                                        </RadioGroup>
                                    </div>
                                    <Separator />
                                    {/* Price */}
                                    <div className="space-y-4">
                                        <Label className="font-semibold">Price</Label>
                                        <div className="flex items-center space-x-2"><Checkbox id="price-free" checked={priceFilter.free} onCheckedChange={() => handlePriceChange('free')}/><Label htmlFor="price-free">Free</Label></div>
                                        <div className="flex items-center space-x-2"><Checkbox id="price-paid" checked={priceFilter.paid} onCheckedChange={() => handlePriceChange('paid')} /><Label htmlFor="price-paid">Paid</Label></div>
                                    </div>
                                    <Separator />
                                    {/* Other Filters */}
                                    <div className="space-y-4">
                                        <Label className="font-semibold">Other Filters</Label>
                                        <div className="flex items-center space-x-2"><Checkbox id="woman-only"/><Label htmlFor="woman-only">Woman Only</Label></div>
                                    </div>
                                    <Separator />
                                    {/* Interests */}
                                    <div className="space-y-4">
                                        <Label className="font-semibold">Interests & Topics</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Reading", "Gaming", "Yoga", "Coding", "Dancing", "Politics"].map(interest => (
                                                <div key={interest} className="flex items-center space-x-2">
                                                    <Checkbox id={`interest-${interest}`} />
                                                    <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t">
                                    <SheetClose asChild>
                                        <Button className="w-full">Apply Filters</Button>
                                    </SheetClose>
                                </div>
                            </SheetContent>
                            </Sheet>
                            <Button onClick={() => setView('friends')}>
                                <Users className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Friends</span>
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                    {filteredAndSortedEvents.map((event, index) => (
                        <EventTile key={event.id} event={event} index={index} />
                    ))}
                </div>
            </div>
             <div className={cn("transition-transform duration-500 ease-in-out h-full flex flex-col -mt-[calc(100vh-6rem)]", {
                'translate-x-[110%]': view === 'explore',
                'translate-x-0': view === 'friends',
                '-translate-x-[110%]': view === 'chats',
            })}>
                <div className="flex justify-between items-center mb-8 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold font-headline mb-2">Discover Friends</h1>
                        <p className="text-muted-foreground">Connect with new people and find common interests.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setView('explore')} variant="outline">
                             <ArrowLeft className="mr-2 h-4 w-4" /> Events
                        </Button>
                        <Button onClick={() => setView('chats')}>
                            Messages <MessageSquare className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                 <ScrollArea className="flex-grow min-h-0">
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pr-4">
                         {filteredSuggestions.map(user => (
                            <UserCard key={user.uid} user={user} onFollow={handleFollow} />
                        ))}
                    </div>
                 </ScrollArea>
            </div>
            <div className={cn("transition-transform duration-500 ease-in-out h-full -mt-[calc(100vh-6rem)]", {
                'translate-x-[220%]': view === 'explore' || view === 'friends',
                'translate-x-0': view === 'chats',
            })}>
                 <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline mb-2">Your Chats</h1>
                        <p className="text-muted-foreground">Continue the conversation with your friends and groups.</p>
                    </div>
                </div>
                <div className="h-[calc(100vh-20rem)]">
                    <ChatList />
                </div>
            </div>
      </main>
    </div>
  );
}
