
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, WifiOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const nearbyEvents = [
  {
    id: "live-jazz-night",
    name: "Live Jazz Night",
    date: "Every Friday",
    location: "The Blue Note Cafe",
    image: "https://placehold.co/400x200.png",
    hint: "jazz club",
    friendsAttending: [
      { name: "Mike", avatar: "https://placehold.co/40x40.png", hint: "man glasses" },
    ],
  },
  {
    id: "farmers-market",
    name: "Farmer's Market",
    date: "This Saturday",
    location: "City Square",
    image: "https://placehold.co/400x200.png",
    hint: "market stall",
    friendsAttending: [
       { name: "Jenna", avatar: "https://placehold.co/40x40.png", hint: "woman portrait" },
    ],
  },
  {
    id: "outdoor-yoga",
    name: "Outdoor Yoga Session",
    date: "This Sunday Morning",
    location: "Lakeside Park",
    image: "https://placehold.co/400x200.png",
    hint: "yoga park",
    friendsAttending: [],
  },
   {
    id: "open-mic-comedy",
    name: "Open Mic Comedy",
    date: "Tonight",
    location: "The Chuckle Hut",
    image: "https://placehold.co/400x200.png",
    hint: "comedy stage",
    friendsAttending: [
      { name: "David", avatar: "https://placehold.co/40x40.png", hint: "man face" },
    ],
  },
];

type GeolocationStatus = 'loading' | 'success' | 'error' | 'idle';

export default function NearbyEventsPage() {
    const [status, setStatus] = useState<GeolocationStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Automatically request location when the component mounts
        setStatus('loading');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, you would use position.coords.latitude and position.coords.longitude
                    // to query your backend for nearby events.
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
    }, []);


  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Nearby Events</h1>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="mb-8">
          {status === 'loading' && (
             <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Finding your location...</AlertTitle>
                <AlertDescription>
                  Please grant permission if prompted. We're looking for events near you.
                </AlertDescription>
              </Alert>
          )}
          {status === 'error' && (
             <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Could not determine location</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
          )}
           {status === 'success' && (
             <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Standort erfolgreich erkannt!</AlertTitle>
                <AlertDescription>
                  Die folgenden Events werden basierend auf Ihrem aktuellen Standort angezeigt.
                </AlertDescription>
              </Alert>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyEvents.map((event, index) => (
                <EventCard key={index} event={event} />
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
