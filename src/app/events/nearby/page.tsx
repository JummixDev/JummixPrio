
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, WifiOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getDistance } from '@/lib/utils';


type EventData = {
    id: string;
    distance?: number;
    [key: string]: any;
};

type GeolocationStatus = 'loading' | 'success' | 'error' | 'idle';

export default function NearbyEventsPage() {
    const [status, setStatus] = useState<GeolocationStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);

    // Fetch all events from Firestore
    useEffect(() => {
        async function fetchEvents() {
            setIsLoadingEvents(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'events'));
                const allEvents = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as EventData[];
                setEvents(allEvents);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Could not load events from the database.");
                setStatus('error');
            } finally {
                setIsLoadingEvents(false);
            }
        }
        fetchEvents();
    }, []);

    // Get user's location and sort events by distance
    useEffect(() => {
        // Don't run until events are loaded
        if (isLoadingEvents || events.length === 0) return;

        setStatus('loading');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    const sortedEvents = events
                        .map(event => {
                            // Assuming events have lat/lon. If not, they will be at the end.
                            if (event.lat && event.lon) {
                                const distance = getDistance(latitude, longitude, event.lat, event.lon);
                                return { ...event, distance };
                            }
                            return { ...event, distance: Infinity }; // Events without location go to the end
                        })
                        .sort((a, b) => a.distance - b.distance);

                    setEvents(sortedEvents);
                    setStatus('success');
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setError("You have denied location access. Please enable it in your browser settings to find nearby events.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                             setError("Your location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                             setError("The request to get your location timed out.");
                            break;
                        default:
                            setError("An unknown error occurred while trying to get your location.");
                            break;
                    }
                    setStatus('error');
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setStatus('error');
        }
    // The dependency array is intentionally shortened to run this effect only once after events are loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingEvents]);


  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Nearby Events</h1>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow pt-16">
        {status === 'loading' && (
             <div className="flex flex-col items-center justify-center text-center p-8">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold">Finding events near you...</h2>
                <p className="text-muted-foreground">Please wait a moment.</p>
            </div>
        )}
         {status === 'error' && (
            <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {status === 'success' && (
            <>
                <Alert className="mb-6 bg-secondary">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Location Found!</AlertTitle>
                    <AlertDescription>Showing events sorted by distance from you.</AlertDescription>
                </Alert>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </>
        )}
      </main>
      <Footer />
    </div>
  );
}
