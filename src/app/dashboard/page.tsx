

'use client';

import { UserProfileCard } from "@/components/jummix/UserProfileCard";
import { Badges } from "@/components/jummix/Badges";
import { EventReels } from "@/components/jummix/EventReels";
import { LiveActivityFeed } from "@/components/jummix/LiveActivityFeed";
import { EventCard } from "@/components/jummix/EventCard";
import { Leaderboard } from "@/components/jummix/Leaderboard";
import { AIRecommender } from "@/components/jummix/AIRecommender";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Menu, MessageSquare, User, Settings, LayoutDashboard, Shield, HelpCircle, Info, Mail, LogOut, Loader2, Heart, Bookmark, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/jummix/Footer";
import { Separator } from "@/components/ui/separator";
import { collection, getDocs, limit, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { GlobalSearch } from "@/components/jummix/GlobalSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPostsFeed } from "@/components/jummix/UserPostsFeed";
import { PeopleNearby } from "@/components/jummix/PeopleNearby";
import { NotificationCenter } from "@/components/jummix/NotificationCenter";


type Event = {
  id: string;
  [key: string]: any;
};

const EventList = ({ eventIds, emptyText }: { eventIds: string[], emptyText: string }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!eventIds || eventIds.length === 0) {
                setLoading(false);
                setEvents([]);
                return;
            }
            setLoading(true);
            try {
                // Firestore 'in' query is limited to 30 elements. Paginate if needed for larger lists.
                const eventsRef = collection(db, "events");
                const q = query(eventsRef, where(documentId(), "in", eventIds.slice(0, 30)));
                const querySnapshot = await getDocs(q);
                const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching event list:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [eventIds]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }
    
    if (events.length === 0) {
        return <p className="text-muted-foreground text-center py-8">{emptyText}</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default function DashboardPage() {
  const { user, loading, signOut, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const isAdmin = user?.email === 'service@jummix.com';
  const isVerifiedHost = userData?.isVerifiedHost || false;
  
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
        try {
            const q = query(collection(db, "events"), limit(4));
            const querySnapshot = await getDocs(q);
            const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
            setUpcomingEvents(fetchedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch events.' });
        } finally {
            setLoadingUpcoming(false);
        }
    }
    fetchEvents();
  }, [toast]);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold font-headline text-primary">Lade Ihr Erlebnis mit Jummix</h1>
        </div>
    );
  }

  const userProfileLink = `/profile/me`;

  return (
    <div className="bg-background min-h-screen font-body flex flex-col">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start hidden lg:block">
            <UserProfileCard />
            <Badges />
            <Leaderboard />
          </aside>

          <div className="lg:col-span-6 space-y-8">
            <div className="md:hidden">
                <GlobalSearch />
            </div>
            <EventReels />
             <div>
                <Tabs defaultValue="upcoming" className="w-full">
                  <div className="flex justify-center mb-4">
                    <TabsList>
                      <TabsTrigger value="upcoming" className="gap-2"><Calendar/>Upcoming</TabsTrigger>
                      <TabsTrigger value="liked" className="gap-2"><Heart/>Liked</TabsTrigger>
                      <TabsTrigger value="saved" className="gap-2"><Bookmark/>Saved</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="upcoming">
                    {loadingUpcoming ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Skeleton className="h-96 w-full" />
                          <Skeleton className="h-96 w-full" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {upcomingEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                          ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="liked">
                      <EventList eventIds={userData?.likedEvents || []} emptyText="You haven't liked any events yet." />
                  </TabsContent>
                  <TabsContent value="saved">
                      <EventList eventIds={userData?.savedEvents || []} emptyText="You haven't saved any events yet." />
                  </TabsContent>
                </Tabs>
                <div className="mt-6 text-center">
                    <Button asChild>
                        <Link href="/explore">
                           Mehr entdecken <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </div>
            </div>
          </div>

          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start">
            <LiveActivityFeed />
             <NotificationCenter />
            <div className="space-y-8">
                <PeopleNearby />
                <UserPostsFeed />
                <AIRecommender />
            </div>
          </aside>

        </div>
      </main>

       {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-24 right-4 z-30 md:hidden">
            <Button asChild size="lg" className="rounded-full shadow-lg h-16 w-16 animate-pulse">
                <Link href="/events/nearby">
                    <MapPin className="h-8 w-8" />
                    <span className="sr-only">Nearby Events</span>
                </Link>
            </Button>
        </div>

      <Footer />
    </div>
  );
}
    
