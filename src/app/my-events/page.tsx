

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Event = {
  id: string;
  [key: string]: any;
};

export default function MyEventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // This is a simplified fetch. A real app would need more complex queries
    // for liked/saved events, likely involving subcollections or array fields.
    useEffect(() => {
        if (!user) return;
        async function fetchMyEvents() {
            setLoading(true);
            try {
                // Fetching all events and filtering client-side for this example
                // A real app should use queries like: where('attendeeUids', 'array-contains', user.uid)
                const querySnapshot = await getDocs(collection(db, 'events'));
                const allEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Event }));
                
                // This is a MOCK implementation of filtering.
                // Replace with actual user data fields later.
                const userEvents = allEvents.filter(event => 
                    event.attendees.some((attendee: any) => attendee.username === 'jennasmith' || attendee.username === 'carlosray')
                );
                setEvents(userEvents);

            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMyEvents();
    }, [user]);

    const today = new Date();
    const upcomingEvents = events.filter(e => new Date(e.date) >= today);
    const pastEvents = events.filter(e => new Date(e.date) < today);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">My Events</h1>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <Tabs defaultValue="upcoming">
            <TabsList className="mb-6 grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            ) : (
                <>
                <TabsContent value="upcoming">
                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-16">
                            <p>You have no upcoming events.</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="past">
                     {pastEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                     ) : (
                        <div className="text-center text-muted-foreground py-16">
                            <p>You have no past events.</p>
                        </div>
                     )}
                </TabsContent>
                <TabsContent value="liked">
                    <div className="text-center text-muted-foreground py-16">
                        <p>You haven't liked any events yet.</p>
                    </div>
                </TabsContent>
                <TabsContent value="saved">
                    <div className="text-center text-muted-foreground py-16">
                        <p>You haven't saved any events yet.</p>
                    </div>
                </TabsContent>
                </>
            )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
