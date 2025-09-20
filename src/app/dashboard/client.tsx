
'use client';

import { UserProfileCard } from "@/components/jummix/UserProfileCard";
import { Badges } from "@/components/jummix/Badges";
import { EventReels } from "@/components/jummix/EventReels";
import { LiveActivityFeed } from "@/components/jummix/LiveActivityFeed";
import { EventCard } from "@/components/jummix/EventCard";
import { Leaderboard } from "@/components/jummix/Leaderboard";
import { AIRecommender } from "@/components/jummix/AIRecommender";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Heart, Bookmark, Calendar, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/jummix/Footer";
import { collection, getDocs, where, documentId, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { GlobalSearch } from "@/components/jummix/GlobalSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPostsFeed } from "@/components/jummix/UserPostsFeed";
import { PeopleNearby } from "@/components/jummix/PeopleNearby";
import { NotificationCenter } from "@/components/jummix/NotificationCenter";
import { Card, CardContent } from "@/components/ui/card";


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

export function DashboardClient({ initialUpcomingEvents }: { initialUpcomingEvents: Event[] }) {
  const { user, loading, signOut, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  const handleNearbyClick = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            () => {
                router.push('/events/nearby');
            },
            (error) => {
                toast({
                    variant: 'destructive',
                    title: 'Location Access Denied',
                    description: 'Please enable location permissions in your browser settings to use this feature.',
                });
            }
        );
    } else {
        toast({
            variant: 'destructive',
            title: 'Geolocation Not Supported',
            description: 'Your browser does not support geolocation.',
        });
    }
  };


  if (loading || !user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold font-headline text-primary">Loading your Jummix experience</h1>
        </div>
    );
  }


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
                <Card>
                    <CardContent className="p-4">
                        <GlobalSearch />
                    </CardContent>
                </Card>
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
                    {initialUpcomingEvents.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {initialUpcomingEvents.map((event) => (
                          <EventCard key={event.id} event={event} />
                          ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Skeleton className="h-96 w-full" />
                          <Skeleton className="h-96 w-full" />
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
                           Discover More <ArrowRight className="ml-2 h-4 w-4"/>
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
            <Button
                size="lg"
                className="rounded-full shadow-lg h-16 w-16 bg-gradient-to-tr from-primary to-accent text-white"
                onClick={handleNearbyClick}
            >
                <MapPin className="h-8 w-8" />
                <span className="sr-only">Nearby Events</span>
            </Button>
        </div>

      <Footer />
    </div>
  );
}
