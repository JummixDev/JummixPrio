
import React from 'react';
import { EventDetailClient } from '@/components/jummix/EventDetailClient';
import { Footer } from '@/components/jummix/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const mockEvents: { [key: string]: any } = {
  "summer-music-fest": {
    id: "summer-music-fest",
    name: "Summer Music Fest",
    date: "August 15-17, 2024",
    location: "Lakeside Park, San Francisco",
    price: 75,
    isFree: false,
    image: "https://placehold.co/1200x600.png",
    hint: "concert crowd",
    description: "Join us for the biggest music festival of the summer! Featuring over 50 artists across 3 days, this is an event you won't want to miss. Enjoy amazing music, great food, and unforgettable vibes by the lake.",
    organizer: {
      name: "SF Music Events",
      avatar: "https://placehold.co/40x40.png",
      hint: "company logo"
    },
    attendees: [
      { name: "Jenna", avatar: "https://placehold.co/40x40.png", hint: "woman portrait" },
      { name: "Mike", avatar: "https://placehold.co/40x40.png", hint: "man glasses" },
      { name: "Alex", avatar: "https://placehold.co/40x40.png", hint: "person portrait" },
    ],
    gallery: [
        { src: "https://placehold.co/600x400.png", hint: "festival stage" },
        { src: "https://placehold.co/600x400.png", hint: "people dancing" },
        { src: "https://placehold.co/600x400.png", hint: "food trucks" },
        { src: "https://placehold.co/600x400.png", hint: "sunset festival" },
    ]
  },
  "tech-innovators-summit": {
    id: "tech-innovators-summit",
    name: "Tech Innovators Summit",
    date: "September 5, 2024",
    location: "Convention Center",
    price: 0,
    isFree: true,
    image: "https://placehold.co/1200x600.png",
    hint: "conference speaker",
    description: "The premier event for technology leaders, innovators, and entrepreneurs. Hear from industry pioneers, discover emerging trends, and network with the best minds in tech. This is a free event, but registration is required.",
    organizer: {
      name: "TechCon Inc.",
      avatar: "https://placehold.co/40x40.png",
      hint: "tech logo"
    },
    attendees: [
      { name: "Carlos", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
      { name: "Aisha", avatar: "https://placehold.co/40x40.png", hint: "woman face" },
    ],
    gallery: [
        { src: "https://placehold.co/600x400.png", hint: "keynote speaker" },
        { src: "https://placehold.co/600x400.png", hint: "networking event" },
    ]
  },
  "downtown-art-walk": {
    id: "downtown-art-walk",
    name: "Downtown Art Walk",
    date: "July 25, 2024",
    location: "Arts District",
    price: 0,
    isFree: true,
    image: "https://placehold.co/1200x600.png",
    hint: "art gallery",
    description: "Explore the vibrant art scene of the downtown Arts District. Visit local galleries, meet artists, and enjoy live music and street performances. A perfect evening for art lovers.",
    organizer: { name: "City Arts Council", avatar: "https://placehold.co/40x40.png", hint: "city seal" },
    attendees: [],
    gallery: [],
  },
  "live-jazz-night": {
    id: "live-jazz-night",
    name: "Live Jazz Night",
    date: "Every Friday",
    location: "The Blue Note Cafe",
    price: 25,
    isFree: false,
    image: "https://placehold.co/1200x600.png",
    hint: "jazz club",
    description: "Experience the soulful sounds of live jazz in an intimate setting. Our house band plays a mix of classics and modern jazz. Full bar and dinner menu available.",
    organizer: { name: "The Blue Note Cafe", avatar: "https://placehold.co/40x40.png", hint: "cafe logo" },
    attendees: [{ name: "Mike", avatar: "https://placehold.co/40x40.png", hint: "man glasses" }],
    gallery: [],
  },
  "farmers-market": {
    id: "farmers-market",
    name: "Farmer's Market",
    date: "Every Saturday",
    location: "City Square",
    price: 0,
    isFree: true,
    image: "https://placehold.co/1200x600.png",
    hint: "market stall",
    description: "Get your fresh, local produce, artisanal goods, and delicious baked treats at the City Square Farmer's Market. Support local farmers and businesses!",
    organizer: { name: "City of Springfield", avatar: "https://placehold.co/40x40.png", hint: "city hall" },
    attendees: [{ name: "Jenna", avatar: "https://placehold.co/40x40.png", hint: "woman portrait" }],
    gallery: [],
  },
  "outdoor-yoga": {
    id: "outdoor-yoga",
    name: "Outdoor Yoga Session",
    date: "Every Sunday Morning",
    location: "Lakeside Park",
    price: 15,
    isFree: false,
    image: "https://placehold.co/1200x600.png",
    hint: "yoga park",
    description: "Start your Sunday with a refreshing yoga session by the lake. All levels are welcome. Please bring your own mat and water bottle.",
    organizer: { name: "ZenFlow Yoga", avatar: "https://placehold.co/40x40.png", hint: "yoga logo" },
    attendees: [],
    gallery: [],
  },
};


export default function EventDetailPage({ params }: { params: { id: string } }) {
    const event = mockEvents[params.id];

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
                <p className="text-muted-foreground mb-8">Sorry, we couldn't find the event you're looking for.</p>
                <Button asChild>
                    <Link href="/explore">Back to Events</Link>
                </Button>
            </div>
        )
    }

  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/explore">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4 truncate">{event.name}</h1>
          </div>
      </header>
      <main className="flex-grow">
        <EventDetailClient event={event} />
      </main>
      <Footer />
    </div>
  );
}

// Generate static paths for mock events
export async function generateStaticParams() {
    return Object.keys(mockEvents).map((id) => ({
        id,
    }));
}
