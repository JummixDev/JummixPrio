

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, Loader2, Users, ArrowRight, MessageSquare, UserPlus, Check, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/jummix/Footer';
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
import { collection, getDocs, query, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { ChatList } from '@/components/jummix/ChatList';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useDebounce } from '@/hooks/use-debounce';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';


const categories = ["Music", "Sports", "Art", "Tech", "Food", "Outdoors", "Comedy", "Workshops"];
const interests = ["Reading", "Gaming", "Yoga", "Coding", "Dancing", "Politics"];

type SortOption = 'relevance' | 'newest' | 'popularity' | 'date_asc' | 'date_desc' | 'rating' | 'price_asc' | 'price_desc' | 'distance';
type DateFilter = 'all' | 'today' | 'weekend' | 'month';
type Event = {
  id: string;
  [key:string]: any;
};
type UserProfile = {
    uid: string;
    displayName: string;
    username: string;
    photoURL: string;
    hint: string;
    followers?: string[];
    following?: string[];
    isVerifiedHost?: boolean;
};

const EventTile = ({ event }: { event: Event }) => (
    <Link href={`/event/${event.id}`} className="block group relative aspect-square overflow-hidden rounded-lg">
        <Image 
            src={event.image || 'https://placehold.co/600x400.png'} 
            alt={event.name || 'Event image'}
            layout="fill" 
            objectFit="cover" 
            className="transition-transform duration-300 ease-in-out group-hover:scale-110"
            data-ai-hint={event.hint || 'event photo'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="font-bold truncate">{event.name}</h3>
            <p className="text-sm">{event.location}</p>
        </div>
    </Link>
)

const FriendList = ({ users, type, onAction, currentUserData }: { users: UserProfile[], type: 'follower' | 'following' | 'suggestion', onAction: () => void, currentUserData: any }) => {
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    const handleFollow = async (targetUserUid: string) => {
        if (!currentUser || !targetUserUid) return;
        
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
                <Button variant="secondary" disabled><UserCheck className="mr-2" /> Following</Button>
            ) : (
                <Button onClick={() => handleFollow(userUid)}><UserPlus className="mr-2" /> Follow Back</Button>
            );
        }
        if (type === 'following') {
            return <Button variant="outline" onClick={() => handleUnfollow(userUid)}>Unfollow</Button>;
        }
        if (type === 'suggestion') {
            return <Button onClick={() => handleFollow(userUid)}><UserPlus className="mr-2" /> Follow</Button>;
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


export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [priceFilter, setPriceFilter] = useState({ free: false, paid: false });
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [view, setView] = useState<'explore' | 'friends' | 'chats'>('explore');

  // State from FriendsPageContent
  const { user, userData, loading: authLoading } = useAuth();
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const debouncedFriendSearchTerm = useDebounce(friendSearchTerm, 300);
  const [friendFilters, setFriendFilters] = useState({ verifiedOnly: false });
  const [friendSortBy, setFriendSortBy] = useState('relevance');

  useEffect(() => {
    async function fetchEvents() {
        try {
            const q = query(collection(db, "events"));
            const querySnapshot = await getDocs(q);
            const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch events.' });
        } finally {
            setLoading(false);
        }
    }
    fetchEvents();
  }, [toast]);

  const fetchFriendData = async () => {
    if (!user) return;
    setLoadingFriends(true);
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const fetchedUsers = querySnapshot.docs.map(doc => ({ uid: doc.id, ...(doc.data() as Omit<UserProfile, 'uid'>) }));
        setAllUsers(fetchedUsers);
    } catch (error) {
        console.error("Error fetching friends data:", error);
    } finally {
        setLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
        fetchFriendData();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || !userData || allUsers.length === 0) return;
    const currentUserFollowers = Array.isArray(userData?.followers) ? userData.followers : [];
    const currentUserFollowing = Array.isArray(userData?.following) ? userData.following : [];
    const followerProfiles = allUsers.filter(u => currentUserFollowers.includes(u.uid));
    setFollowers(followerProfiles);
    const followingProfiles = allUsers.filter(u => currentUserFollowing.includes(u.uid));
    setFollowing(followingProfiles);
  }, [allUsers, userData, user]);
  
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter.free && !priceFilter.paid) {
      filtered = filtered.filter(event => event.isFree);
    } else if (!priceFilter.free && priceFilter.paid) {
      filtered = filtered.filter(event => !event.isFree);
    }

    const today = new Date();
    if (dateFilter === 'today') {
       filtered = filtered.filter(event => new Date(event.date).toDateString() === today.toDateString());
    }

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
        filtered.sort((a, b) => b.price - b.price);
        break;
      case 'relevance':
      default:
        break;
    }

    return filtered;
  }, [searchTerm, sortBy, priceFilter, dateFilter, events]);
  
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


  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">
              <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild={view === 'explore'} 
                  onClick={view !== 'explore' ? handleBackClick : undefined}
                  className="hidden sm:inline-flex"
               >
                   {view === 'explore' ? (
                       <Link href="/dashboard"><ArrowLeft /></Link>
                   ) : (
                       <ArrowLeft />
                   )}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
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
                                {interests.map(interest => (
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
          </div>
      </header>
       <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow overflow-hidden pt-16 h-full">
            <div className={cn("transition-transform duration-500 ease-in-out h-full", {
                'translate-x-0': view === 'explore',
                '-translate-x-[110%]': view === 'friends' || view === 'chats',
            })}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline mb-2">Discover Events</h1>
                        <p className="text-muted-foreground">Find your next great experience from our curated list of events.</p>
                    </div>
                    <Button onClick={() => setView('friends')}>
                        Freunde entdecken <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-auto aspect-square w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredAndSortedEvents.map((event) => (
                            <EventTile key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
            <div className={cn("transition-transform duration-500 ease-in-out h-full flex flex-col -mt-[100%]", {
                'translate-x-[110%]': view === 'explore',
                'translate-x-0': view === 'friends',
                '-translate-x-[110%]': view === 'chats',
            })}>
                <div className="flex justify-between items-center mb-8 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold font-headline mb-2">Freunde entdecken</h1>
                        <p className="text-muted-foreground">Vernetze dich mit neuen Leuten und finde gemeinsame Interessen.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setView('explore')} variant="outline">
                             <ArrowLeft className="mr-2 h-4 w-4" /> Events entdecken
                        </Button>
                        <Button onClick={() => setView('chats')}>
                            Nachricht schreiben <MessageSquare className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                 <ScrollArea className="flex-grow h-[calc(100vh-20rem)]">
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
                                                value={friendSearchTerm}
                                                onChange={e => setFriendSearchTerm(e.target.value)}
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
                                                    <SheetDescription>Refine your search for new friends.</SheetDescription>
                                                </SheetHeader>
                                                <div className="py-4 space-y-6">
                                                    <div className="space-y-4">
                                                        <Label className="font-semibold">Sort by</Label>
                                                        <RadioGroup value={friendSortBy} onValueChange={setFriendSortBy}>
                                                            <div className="flex items-center space-x-2"><RadioGroupItem value="relevance" id="fs1" /><Label htmlFor="fs1">Relevance</Label></div>
                                                            <div className="flex items-center space-x-2"><RadioGroupItem value="new" id="fs2" /><Label htmlFor="fs2">Newly Registered</Label></div>
                                                            <div className="flex items-center space-x-2"><RadioGroupItem value="active" id="fs3" /><Label htmlFor="fs3">Most Active</Label></div>
                                                        </RadioGroup>
                                                    </div>
                                                    <Separator/>
                                                    <div className="space-y-4">
                                                        <Label className="font-semibold">Filters</Label>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox id="verified-only" checked={friendFilters.verifiedOnly} onCheckedChange={(checked) => setFriendFilters(f => ({...f, verifiedOnly: !!checked}))} />
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
                                                <SheetClose asChild className="absolute bottom-4 right-4"><Button>Apply</Button></SheetClose>
                                            </SheetContent>
                                        </Sheet>
                                    </div>
                                </div>
                                {loadingFriends ? (
                                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
                                ) : (
                                    <>
                                        <TabsContent value="followers"><FriendList users={followers} type="follower" onAction={fetchFriendData} currentUserData={userData} /></TabsContent>
                                        <TabsContent value="following"><FriendList users={following} type="following" onAction={fetchFriendData} currentUserData={userData} /></TabsContent>
                                        <TabsContent value="suggestions"><FriendList users={filteredSuggestions} type="suggestion" onAction={fetchFriendData} currentUserData={userData} /></TabsContent>
                                    </>
                                )}
                            </Tabs>
                        </CardContent>
                    </Card>
                 </ScrollArea>
            </div>
            <div className={cn("transition-transform duration-500 ease-in-out h-full -mt-[100%]", {
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
      <Footer />
    </div>
  );
}


