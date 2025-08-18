
'use client';

import React, { useEffect, useState } from 'react';
import { EventDetailClient } from '@/components/jummix/EventDetailClient';
import { Footer } from '@/components/jummix/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';

// Define a type for your event data for better type safety
type EventData = {
    id: string;
    [key: string]: any;
};

export default function EventDetailPage() {
    const params = useParams();
    const eventId = params.id as string;
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) return;

        async function fetchEvent() {
            try {
                setLoading(true);
                const eventDocRef = doc(db, "events", eventId);
                const eventDocSnap = await getDoc(eventDocRef);

                if (eventDocSnap.exists()) {
                    setEvent({ id: eventDocSnap.id, ...eventDocSnap.data() });
                } else {
                    setError("Event not found.");
                }
            } catch (err) {
                console.error("Error fetching event:", err);
                // It's good practice to provide a more user-friendly error message
                setError("Failed to load event. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Lade Ihr Erlebnis mit Jummix</h1>
            </div>
        );
    }
    
    if (error || !event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <h1 className="text-4xl font-bold mb-4">{error ? 'Error' : 'Event Not Found'}</h1>
                <p className="text-muted-foreground mb-8">{error || "We couldn't find the event you're looking for."}</p>
                <Button asChild>
                    <Link href="/explore">Back to Events</Link>
                </Button>
            </div>
        )
    }

  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4 truncate">{event.name || "Event"}</h1>
          </div>
      </header>
      <main className="flex-grow pt-16">
        <EventDetailClient event={event} />
      </main>
      <Footer />
    </div>
  );
}
