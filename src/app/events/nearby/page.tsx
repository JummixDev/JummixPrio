
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';

const nearbyEvents = [
  {
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
    name: "Outdoor Yoga Session",
    date: "This Sunday Morning",
    location: "Lakeside Park",
    image: "https://placehold.co/400x200.png",
    hint: "yoga park",
    friendsAttending: [],
  },
   {
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

export default function NearbyEventsPage() {
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
          <p className="text-muted-foreground">Showing events near you. To improve accuracy, please enable location services.</p>
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
