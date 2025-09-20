
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/jummix/EventCard';
import { LiveActivityFeed, LiveActivityFeedExpanded } from '@/components/jummix/LiveActivityFeed';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Calendar, Compass, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, documentId, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PeopleNearby, PeopleNearbyExpanded } from '@/components/jummix/PeopleNearby';
import { EventReels } from '@/components/jummix/EventReels';
import { UserPostsFeed, UserPostsFeedExpanded } from '@/components/jummix/UserPostsFeed';
import { NotificationCenter, NotificationCenterExpanded } from '@/components/jummix/NotificationCenter';
import { Leaderboard, LeaderboardExpanded } from '@/components/jummix/Leaderboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

export type Event = {
  id: string;
  [key: string]: any; // Allow other event properties
};

type DashboardClientProps = {
  initialUpcomingEvents: Event[];
};

const EventListWidget = ({ initialUpcomingEvents, savedEvents, likedEvents, loadingInteractions }: { initialUpcomingEvents: Event[], savedEvents: Event[], likedEvents: Event[], loadingInteractions: boolean }) => (
    <Card className="h-full flex flex-col">
         <CardHeader>
            <Link href="/explore" className="block p-2 -m-2 rounded-lg hover:bg-muted/50">
                 <CardTitle className="font-headline text-2xl flex items-center gap-2"><Compass /> Discover Events</CardTitle>
                <CardDescription>Find your next great experience from our curated list of events.</CardDescription>
            </Link>
        </CardHeader>
        <CardContent className='col-span-12 h-full flex-grow'>
            <Tabs defaultValue="upcoming" className="w-full h-full flex flex-col">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="liked">Liked</TabsTrigger>
                    <TabsTrigger value="saved">Saved For You</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="mt-6 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialUpcomingEvents.length > 0 ? (
                        initialUpcomingEvents.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                        <p className="text-muted-foreground col-span-full">No upcoming events right now. Check back soon!</p>
                    )}
                    </div>
                </TabsContent>
                <TabsContent value="liked" className="mt-6 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingInteractions ? <Loader2 className="animate-spin" /> : likedEvents.length > 0 ? (
                        likedEvents.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                        <p className="text-muted-foreground col-span-full">You haven't liked any events yet. Start exploring!</p>
                    )}
                    </div>
                </TabsContent>
                <TabsContent value="saved" className="mt-6 flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loadingInteractions ? <Loader2 className="animate-spin" /> : savedEvents.length > 0 ? (
                        savedEvents.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                        <p className="text-muted-foreground col-span-full">You have no saved events. Bookmark events to see them here.</p>
                    )}
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
);


const EventsCompact = ({ events, onZoom }: { events: Event[], onZoom: () => void }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline">Upcoming Events</CardTitle>
                <CardDescription className="text-xs">Your next adventures.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0" onClick={onZoom}>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </Button>
        </CardHeader>
        <CardContent>
            {events.length > 0 ? (
                 <ul className="space-y-4">
                    {events.slice(0, 2).map(event => (
                        <li key={event.id}>
                             <Link href={`/event/${event.id}`} className="flex items-center gap-4 group">
                                <div className="bg-secondary p-3 rounded-lg flex flex-col items-center justify-center">
                                    <span className="text-xs uppercase font-bold text-primary">{format(new Date(event.date), 'MMM')}</span>
                                    <span className="text-lg font-bold">{format(new Date(event.date), 'dd')}</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{event.name}</p>
                                    <p className="text-xs text-muted-foreground">{event.location}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                 </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
            )}
        </CardContent>
    </Card>
);

// Helper function to shuffle an array
const shuffleArray = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}


export function DashboardClient({ initialUpcomingEvents }: DashboardClientProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  
  const [likedEvents, setLikedEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(true);
  const [mainWidgetId, setMainWidgetId] = useState('events');

  const handleWidgetZoom = (widgetId: string) => {
      setMainWidgetId(widgetId);
  }

  // Define all possible widgets for the dynamic sections
  const allWidgets = useMemo(() => [
      { id: 'events', 
        compact: <EventsCompact events={initialUpcomingEvents} onZoom={() => handleWidgetZoom('events')} />,
        expanded: (
            <EventListWidget 
                initialUpcomingEvents={initialUpcomingEvents}
                likedEvents={likedEvents}
                savedEvents={savedEvents}
                loadingInteractions={loadingInteractions}
            />
        ) 
      },
      { id: 'leaderboard', compact: <Leaderboard onZoom={() => handleWidgetZoom('leaderboard')} />, expanded: <LeaderboardExpanded /> },
      { id: 'people-nearby', compact: <PeopleNearby onZoom={() => handleWidgetZoom('people-nearby')} />, expanded: <PeopleNearbyExpanded /> },
      { id: 'activity', compact: <LiveActivityFeed onZoom={() => handleWidgetZoom('activity')} />, expanded: <LiveActivityFeedExpanded /> },
      { id: 'posts', compact: <UserPostsFeed onZoom={() => handleWidgetZoom('posts')} />, expanded: <UserPostsFeedExpanded /> },
      { id: 'notifications', compact: <NotificationCenter onZoom={() => handleWidgetZoom('notifications')} />, expanded: <NotificationCenterExpanded /> },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [initialUpcomingEvents, likedEvents, savedEvents, loadingInteractions]);

  // Derive current main widget and sidebar widgets based on mainWidgetId
  const mainWidget = allWidgets.find(w => w.id === mainWidgetId);
  const sidebarWidgets = allWidgets.filter(w => w.id !== mainWidgetId);

  // Shuffle sidebar widgets once on initial render (or when the set of widgets changes)
  const shuffledWidgets = useMemo(() => {
    const shuffled = shuffleArray([...sidebarWidgets]);
    return {
        topWidget: shuffled[0],
        sidebarWidgets: shuffled.slice(1),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainWidgetId]); 

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
      const fetchInteractionEvents = async () => {
          if (userData && (userData.likedEvents?.length || userData.savedEvents?.length)) {
              setLoadingInteractions(true);
              const allIds = [...(userData.likedEvents || []), ...(userData.savedEvents || [])];
              const uniqueIds = [...new Set(allIds)];

              if (uniqueIds.length > 0) {
                   // Firestore 'in' query is limited to 30 items.
                  const eventsRef = collection(db, "events");
                  const q = query(eventsRef, where(documentId(), "in", uniqueIds.slice(0, 30)));
                  const querySnapshot = await getDocs(q);
                  const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Event }));

                  setLikedEvents(fetchedEvents.filter(e => userData.likedEvents?.includes(e.id)));
                  setSavedEvents(fetchedEvents.filter(e => userData.savedEvents?.includes(e.id)));
              }
              setLoadingInteractions(false);
          } else {
             setLoadingInteractions(false);
          }
      };

      if (!loading && userData) {
        fetchInteractionEvents();
      }
  }, [userData, loading]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold font-headline text-primary">Loading your Jummix experience</h1>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <EventReels />
            </div>
            <div className="hidden lg:block">
                 {shuffledWidgets.topWidget?.compact}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
            <div className="lg:col-span-8">
                {mainWidget?.expanded}
            </div>

             <aside className="lg:col-span-4 space-y-6">
                {shuffledWidgets.sidebarWidgets.map(widget => (
                    <React.Fragment key={widget.id}>
                        {widget.compact}
                    </React.Fragment>
                ))}
            </aside>
        </div>
    </main>
  );
}
