
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Heart, Bookmark, Calendar } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Event = {
  id: string;
  [key: string]: any;
};

const EventList = ({ eventIds, emptyText, filter }: { eventIds: string[], emptyText: string, filter?: 'upcoming' | 'past' }) => {
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
                let fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
                
                if (filter) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Normalize to start of day
                    if (filter === 'upcoming') {
                        fetchedEvents = fetchedEvents.filter(e => new Date(e.date) >= today);
                    } else { // past
                        fetchedEvents = fetchedEvents.filter(e => new Date(e.date) < today);
                    }
                }
                
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching event list:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [eventIds, filter]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-[330px] w-full" />
                <Skeleton className="h-[330px] w-full" />
                <Skeleton className="h-[330px] w-full" />
            </div>
        );
    }
    
    if (events.length === 0) {
        return <p className="text-muted-foreground text-center py-16">{emptyText}</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};


export default function MyEventsPage() {
    const { user, userData, loading } = useAuth();
    
    // We get the user's booking IDs from their user data.
    const attendedEventIds = userData?.bookings || [];

  return (
    <div className="bg-secondary/20 min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">My Event Library</h1>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-16 pb-24 flex-grow">
        {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        ) : (
            <Tabs defaultValue="upcoming">
                <TabsList className="mb-6 grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
                    <TabsTrigger value="upcoming" className="gap-2"><Calendar/>Upcoming</TabsTrigger>
                    <TabsTrigger value="past" className="gap-2"><Calendar/>Past</TabsTrigger>
                    <TabsTrigger value="liked" className="gap-2"><Heart/>Liked</TabsTrigger>
                    <TabsTrigger value="saved" className="gap-2"><Bookmark/>Saved</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    <EventList 
                        eventIds={attendedEventIds} 
                        filter="upcoming"
                        emptyText="You have no upcoming events." 
                    />
                </TabsContent>
                <TabsContent value="past">
                    <EventList 
                        eventIds={attendedEventIds} 
                        filter="past"
                        emptyText="You have no past events." 
                    />
                </TabsContent>
                <TabsContent value="liked">
                    <EventList 
                        eventIds={userData?.likedEvents || []} 
                        emptyText="You haven't liked any events yet." 
                    />
                </TabsContent>
                <TabsContent value="saved">
                    <EventList 
                        eventIds={userData?.savedEvents || []} 
                        emptyText="You haven't saved any events yet." 
                    />
                </TabsContent>
            </Tabs>
        )}
      </main>
    </div>
  );
}
