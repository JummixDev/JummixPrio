
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const upcomingEvents = [
  {
    id: "summer-music-fest",
    name: "Summer Music Fest",
    date: "2024-08-15",
    location: "Lakeside Park",
    image: "https://placehold.co/400x200.png",
    hint: "concert crowd",
    friendsAttending: [],
  },
  {
    id: "tech-innovators-summit",
    name: "Tech Innovators Summit",
    date: "2024-09-05",
    location: "Convention Center",
    image: "https://placehold.co/400x200.png",
    hint: "conference speaker",
    friendsAttending: [],
  }
];

const pastEvents = [
    {
        id: "downtown-art-walk",
        name: "Downtown Art Walk",
        date: "2024-07-25",
        location: "Arts District",
        image: "https://placehold.co/400x200.png",
        hint: "art gallery",
        price: 0,
        isFree: true,
        friendsAttending: [],
    }
]

export default function MyEventsPage() {
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
            <TabsList className="mb-6 grid w-full grid-cols-3 sm:w-auto sm:grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="past">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
                </div>
            </TabsContent>
             <TabsContent value="liked">
                <div className="text-center text-muted-foreground py-16">
                    <p>You haven't liked any events yet.</p>
                </div>
            </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
