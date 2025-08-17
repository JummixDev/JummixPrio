

'use client';

import { UserProfileCard } from "@/components/jummix/UserProfileCard";
import { Badges } from "@/components/jummix/Badges";
import { EventReels } from "@/components/jummix/EventReels";
import { LiveActivityFeed } from "@/components/jummix/LiveActivityFeed";
import { EventCard } from "@/components/jummix/EventCard";
import { Leaderboard } from "@/components/jummix/Leaderboard";
import { AIRecommender } from "@/components/jummix/AIRecommender";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Menu, MessageSquare, User, Settings, LayoutDashboard, Shield, HelpCircle, Info, Mail, LogOut, Loader2, Heart, Bookmark, Calendar } from "lucide-react";
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
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
            </Link>
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <GlobalSearch />
            </div>
            <div className="flex items-center gap-1">
              <Button asChild variant="ghost" size="icon">
                <Link href="/chats">
                  <MessageSquare />
                  <span className="sr-only">Chats</span>
                </Link>
              </Button>
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                    <SheetHeader className="p-6 pb-4 border-b">
                        <SheetTitle>
                           Jummix Menu
                        </SheetTitle>
                    </SheetHeader>
                  <div className="flex-grow overflow-y-auto">
                    <nav className="p-4 space-y-1">
                        <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                           <Link href={userProfileLink}>
                            <User className="mr-2 h-5 w-5" /> My Profile
                          </Link>
                        </Button>
                        
                         {isAdmin && (
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                               <Link href="/admin">
                                <Shield className="mr-2 h-5 w-5" /> Admin Dashboard
                              </Link>
                            </Button>
                        )}
                        
                        {isVerifiedHost || isAdmin ? (
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                                <Link href="/host/dashboard">
                                <LayoutDashboard className="mr-2 h-5 w-5" /> Host Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                                <Link href="/host/apply-verification">
                                <LayoutDashboard className="mr-2 h-5 w-5" /> Als Host bewerben
                                </Link>
                            </Button>
                        )}

                        <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                           <Link href="/settings">
                            <Settings className="mr-2 h-5 w-5" /> Settings
                          </Link>
                        </Button>
                        <Separator />
                         <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                           <Link href="/about">
                            <Info className="mr-2 h-5 w-5" /> Über uns
                          </Link>
                        </Button>
                         <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                           <Link href="/contact">
                            <Mail className="mr-2 h-5 w-5" /> Kontakt
                          </Link>
                        </Button>
                         <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                           <Link href="/faq">
                            <HelpCircle className="mr-2 h-5 w-5" /> FAQ
                          </Link>
                        </Button>
                    </nav>
                  </div>
                    <div className="p-4 border-t">
                        <Button variant="ghost" className="w-full justify-start text-base py-6" onClick={signOut}>
                            <LogOut className="mr-2 h-5 w-5" /> Sign Out
                        </Button>
                    </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start hidden lg:block">
            <UserProfileCard />
            <Badges />
          </aside>

          <div className="lg:col-span-6 space-y-8">
            <div className="md:hidden">
                <GlobalSearch />
            </div>
            <EventReels />
            <LiveActivityFeed />
             <div>
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="upcoming" className="gap-2"><Calendar/>Upcoming</TabsTrigger>
                    <TabsTrigger value="liked" className="gap-2"><Heart/>Liked</TabsTrigger>
                    <TabsTrigger value="saved" className="gap-2"><Bookmark/>Saved</TabsTrigger>
                  </TabsList>
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
            </div>
          </div>

          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start">
            <Leaderboard />
            <AIRecommender />
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
    