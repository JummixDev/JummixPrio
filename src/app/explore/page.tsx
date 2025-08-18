

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, Loader2, Users, ArrowRight, MessageSquare } from 'lucide-react';
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
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { GlobalSearch } from '@/components/jummix/GlobalSearch';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import FriendsPageContent from '../friends/page';
import ChatsPageContent from '../chats/page';
import { cn } from '@/lib/utils';


const categories = ["Music", "Sports", "Art", "Tech", "Food", "Outdoors", "Comedy", "Workshops"];
const interests = ["Reading", "Gaming", "Yoga", "Coding", "Dancing", "Politics"];

type SortOption = 'relevance' | 'newest' | 'popularity' | 'date_asc' | 'date_desc' | 'rating' | 'price_asc' | 'price_desc' | 'distance';
type DateFilter = 'all' | 'today' | 'weekend' | 'month';
type Event = {
  id: string;
  [key:string]: any;
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

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [priceFilter, setPriceFilter] = useState({ free: false, paid: false });
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [view, setView] = useState<'explore' | 'friends' | 'chats'>('explore');

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
  
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price
    if (priceFilter.free && !priceFilter.paid) {
      filtered = filtered.filter(event => event.isFree);
    } else if (!priceFilter.free && priceFilter.paid) {
      filtered = filtered.filter(event => !event.isFree);
    } // if both are true or false, no price filter is applied

    // Filter by date (simplified example)
    const today = new Date();
    if (dateFilter === 'today') {
       filtered = filtered.filter(event => new Date(event.date).toDateString() === today.toDateString());
    }
    // Note: More complex date logic for 'weekend' and 'month' would be needed for a real app.

    // Sort events
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
        // No specific sorting for relevance in this mock-up
        break;
    }

    return filtered;
  }, [searchTerm, sortBy, priceFilter, dateFilter, events]);

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
              <div className="relative flex-grow">
                <GlobalSearch />
              </div>
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
                '-translate-x-[110%]': view === 'friends',
                '-translate-x-[220%]': view === 'chats',
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
            <div className={cn("transition-transform duration-500 ease-in-out h-full -mt-[100%]", {
                'translate-x-[110%]': view === 'explore',
                'translate-x-0': view === 'friends',
                '-translate-x-[110%]': view === 'chats',
            })}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline mb-2">Discover Friends</h1>
                        <p className="text-muted-foreground">Connect with new people and find shared interests.</p>
                    </div>
                    <Button onClick={() => setView('chats')}>
                        Nachricht schreiben <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <FriendsPageContent />
            </div>
            <div className={cn("transition-transform duration-500 ease-in-out h-full -mt-[100%]", {
                'translate-x-[220%]': view === 'explore',
                'translate-x-[110%]': view === 'friends',
                'translate-x-0': view === 'chats',
            })}>
                 <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline mb-2">Your Chats</h1>
                        <p className="text-muted-foreground">Continue the conversation with your friends and groups.</p>
                    </div>
                </div>
                <div className="h-[calc(100vh-20rem)]">
                    <ChatsPageContent />
                </div>
            </div>
      </main>
      <Footer />
    </div>
  );
}
