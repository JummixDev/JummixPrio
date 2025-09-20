
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/jummix/EventCard';
import { LiveActivityFeed, LiveActivityFeedExpanded } from '@/components/jummix/LiveActivityFeed';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PeopleNearby, PeopleNearbyExpanded } from '@/components/jummix/PeopleNearby';
import { EventReels } from '@/components/jummix/EventReels';
import { UserPostsFeed, UserPostsFeedExpanded } from '@/components/jummix/UserPostsFeed';
import { NotificationCenter, NotificationCenterExpanded } from '@/components/jummix/NotificationCenter';
import { Leaderboard, LeaderboardExpanded } from '@/components/jummix/Leaderboard';
import { Badges, BadgesExpanded } from '@/components/jummix/Badges';

export type Event = {
  id: string;
  [key: string]: any; // Allow other event properties
};

type DashboardClientProps = {
  initialUpcomingEvents: Event[];
};

const EventListWidget = ({ initialUpcomingEvents, savedEvents, likedEvents, loadingInteractions }: { initialUpcomingEvents: Event[], savedEvents: Event[], likedEvents: Event[], loadingInteractions: boolean }) => (
    <div className='col-span-12'>
        <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
                <TabsTrigger value="saved">Saved For You</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialUpcomingEvents.length > 0 ? (
                    initialUpcomingEvents.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                    <p className="text-muted-foreground col-span-full">No upcoming events right now. Check back soon!</p>
                )}
                </div>
            </TabsContent>
            <TabsContent value="liked" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingInteractions ? <Loader2 className="animate-spin" /> : likedEvents.length > 0 ? (
                    likedEvents.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                    <p className="text-muted-foreground col-span-full">You haven't liked any events yet. Start exploring!</p>
                )}
                </div>
            </TabsContent>
            <TabsContent value="saved" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingInteractions ? <Loader2 className="animate-spin" /> : savedEvents.length > 0 ? (
                    savedEvents.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                    <p className="text-muted-foreground col-span-full">You have no saved events. Bookmark events to see them here.</p>
                )}
                </div>
            </TabsContent>
        </Tabs>
    </div>
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

  // Define all possible widgets for the dynamic sections
  const allWidgets = useMemo(() => [
      { id: 'events', 
        compact: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialUpcomingEvents.slice(0,3).map(event => <EventCard key={event.id} event={event} />)}
            </div>
        ), 
        expanded: (
            <EventListWidget 
                initialUpcomingEvents={initialUpcomingEvents}
                likedEvents={likedEvents}
                savedEvents={savedEvents}
                loadingInteractions={loadingInteractions}
            />
        ) 
      },
      { id: 'leaderboard', compact: <Leaderboard />, expanded: <LeaderboardExpanded /> },
      { id: 'badges', compact: <Badges />, expanded: <BadgesExpanded /> },
      { id: 'people-nearby', compact: <PeopleNearby />, expanded: <PeopleNearbyExpanded /> },
      { id: 'activity', compact: <LiveActivityFeed />, expanded: <LiveActivityFeedExpanded /> },
      { id: 'posts', compact: <UserPostsFeed />, expanded: <UserPostsFeedExpanded /> },
      { id: 'notifications', compact: <NotificationCenter />, expanded: <NotificationCenterExpanded /> },
  ], [initialUpcomingEvents, likedEvents, savedEvents, loadingInteractions]);

  // Shuffle widgets once on component mount
  const shuffledWidgets = useMemo(() => {
    const shuffled = shuffleArray([...allWidgets]);
    return {
        mainWidget: shuffled.pop(),
        topWidget: shuffled.pop(),
        sidebarWidgets: shuffled,
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-24 space-y-8">
        {/* Top section with Event Stories and a random widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <EventReels />
            </div>
            <div className="hidden lg:block">
                 {shuffledWidgets.topWidget?.compact}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Content Area - Shows one expanded widget */}
            <div className="lg:col-span-8 space-y-8">
                {shuffledWidgets.mainWidget?.expanded}
            </div>

             {/* Right Sidebar - Shows the rest of the widgets, compact */}
             <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
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
