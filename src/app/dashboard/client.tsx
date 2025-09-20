
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/jummix/EventCard';
import { UserProfileCard } from '@/components/jummix/UserProfileCard';
import { LiveActivityFeed } from '@/components/jummix/LiveActivityFeed';
import { Badges } from '@/components/jummix/Badges';
import { AIRecommender } from '@/components/jummix/AIRecommender';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, documentId, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Leaderboard } from '@/components/jummix/Leaderboard';
import { PeopleNearby } from '@/components/jummix/PeopleNearby';
import { EventReels } from '@/components/jummix/EventReels';
import { UserPostsFeed } from '@/components/jummix/UserPostsFeed';
import { NotificationCenter } from '@/components/jummix/NotificationCenter';

export type Event = {
  id: string;
  [key: string]: any; // Allow other event properties
};

type DashboardClientProps = {
  initialUpcomingEvents: Event[];
};

export function DashboardClient({ initialUpcomingEvents }: DashboardClientProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  
  const [likedEvents, setLikedEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(true);

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
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
            {/* Event Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
                <TabsTrigger value="saved">Saved For You</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {initialUpcomingEvents.length > 0 ? (
                    initialUpcomingEvents.map(event => <EventCard key={event.id} event={event} />)
                  ) : (
                    <p className="text-muted-foreground col-span-full">No upcoming events right now. Check back soon!</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="liked" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loadingInteractions ? <Loader2 className="animate-spin" /> : likedEvents.length > 0 ? (
                    likedEvents.map(event => <EventCard key={event.id} event={event} />)
                  ) : (
                    <p className="text-muted-foreground col-span-full">You haven't liked any events yet. Start exploring!</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="saved" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loadingInteractions ? <Loader2 className="animate-spin" /> : savedEvents.length > 0 ? (
                    savedEvents.map(event => <EventCard key={event.id} event={event} />)
                  ) : (
                    <p className="text-muted-foreground col-span-full">You have no saved events. Bookmark events to see them here.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <UserProfileCard />
          <AIRecommender />
          <LiveActivityFeed />
          <Leaderboard />
          <Badges />
          <UserPostsFeed />
          <NotificationCenter />
        </div>
      </div>
    </main>
  );
}
