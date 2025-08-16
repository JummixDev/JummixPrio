import { UserProfileCard } from "@/components/jummix/UserProfileCard";
import { Badges } from "@/components/jummix/Badges";
import { EventReels } from "@/components/jummix/EventReels";
import { LiveActivityFeed } from "@/components/jummix/LiveActivityFeed";
import { EventCard } from "@/components/jummix/EventCard";
import { Leaderboard } from "@/components/jummix/Leaderboard";
import { AIRecommender } from "@/components/jummix/AIRecommender";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const events = [
  {
    name: "Summer Music Fest",
    date: "August 15-17, 2024",
    location: "Lakeside Park",
    image: "https://placehold.co/400x200.png",
    hint: "concert crowd",
    friendsAttending: [
      { name: "Jenna", avatar: "https://placehold.co/40x40.png", hint: "woman portrait" },
      { name: "Mike", avatar: "https://placehold.co/40x40.png", hint: "man glasses" },
    ],
  },
  {
    name: "Tech Innovators Summit",
    date: "September 5, 2024",
    location: "Convention Center",
    image: "https://placehold.co/400x200.png",
    hint: "conference speaker",
    friendsAttending: [
      { name: "Carlos", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
      { name: "Aisha", avatar: "https://placehold.co/40x40.png", hint: "woman face" },
      { name: "David", avatar: "https://placehold.co/40x40.png", hint: "man face" },
      { name: "Alex", avatar: "https://placehold.co/40x40.png", hint: "person portrait" },
    ],
  },
  {
    name: "Downtown Art Walk",
    date: "July 25, 2024",
    location: "Arts District",
    image: "https://placehold.co/400x200.png",
    hint: "art gallery",
    friendsAttending: [],
  },
  {
    name: "Community Charity Gala",
    date: "October 12, 2024",
    location: "The Grand Ballroom",
    image: "https://placehold.co/400x200.png",
    hint: "formal event",
    friendsAttending: [
      { name: "Carlos", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
    ],
  },
];

export default function Home() {
  return (
    <div className="bg-background min-h-screen font-body">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search events or friends..." className="pl-10" />
              </div>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <MapPin className="mr-2 h-4 w-4" /> Attend Nearby
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start">
            <UserProfileCard />
            <Badges />
          </aside>

          <div className="lg:col-span-6 space-y-8">
            <EventReels />
            <LiveActivityFeed />
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 self-start">
            <Leaderboard />
            <AIRecommender />
          </aside>

        </div>
      </main>
    </div>
  );
}
