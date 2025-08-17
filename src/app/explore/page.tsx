

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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


const categories = ["Music", "Sports", "Art", "Tech", "Food", "Outdoors", "Comedy", "Workshops"];

type SortOption = 'relevance' | 'date' | 'popularity' | 'price';
type DateFilter = 'all' | 'today' | 'weekend' | 'month';
type Event = {
  id: string;
  [key: string]: any;
};

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [priceFilter, setPriceFilter] = useState({ free: false, paid: false });
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

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
      case 'date':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0));
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
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


  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-20 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">
              <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
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
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Filter Events</SheetTitle>
                        <SheetDescription>
                            Refine your search to find the perfect event.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-6">
                        <div className="space-y-4">
                            <Label className="font-semibold">Sort by</Label>
                             <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="relevance" id="r1" />
                                    <Label htmlFor="r1">Relevance</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="date" id="r2" />
                                    <Label htmlFor="r2">Date</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="popularity" id="r3" />
                                    <Label htmlFor="r3">Popularity</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="price" id="r4" />
                                    <Label htmlFor="r4">Price</Label>
                                </div>
                             </RadioGroup>
                        </div>
                        <div className="space-y-4">
                            <Label className="font-semibold">Price</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-free" checked={priceFilter.free} onCheckedChange={() => handlePriceChange('free')}/>
                                <Label htmlFor="price-free">Free</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-paid" checked={priceFilter.paid} onCheckedChange={() => handlePriceChange('paid')} />
                                <Label htmlFor="price-paid">Paid</Label>
                            </div>
                        </div>
                         <div className="space-y-4">
                            <Label className="font-semibold">Date</Label>
                             <RadioGroup value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="d1" />
                                    <Label htmlFor="d1">Anytime</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="today" id="d2" />
                                    <Label htmlFor="d2">Today</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="weekend" id="d3" />
                                    <Label htmlFor="d3">This Weekend</Label>
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="month" id="d4" />
                                    <Label htmlFor="d4">This Month</Label>
                                </div>
                             </RadioGroup>
                        </div>
                    </div>
                </SheetContent>
              </Sheet>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold font-headline mb-2">Discover Events</h1>
                <p className="text-muted-foreground">Find your next great experience from our curated list of events.</p>
            </div>
            <Button onClick={() => router.push('/friends')}>
                <Users className="mr-2 h-4 w-4" />
                Zu Freunden
            </Button>
        </div>
        
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Top Categories</h2>
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <Button key={category} variant="outline">{category}</Button>
                ))}
            </div>
        </div>
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
