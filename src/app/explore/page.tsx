
'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/jummix/EventCard';
import { Footer } from '@/components/jummix/Footer';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';


const exploreEvents = [
  {
    id: "summer-music-fest",
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
    id: "tech-innovators-summit",
    name: "Tech Innovators Summit",
    date: "September 5, 2024",
    location: "Convention Center",
    image: "https://placehold.co/400x200.png",
    hint: "conference speaker",
    friendsAttending: [
      { name: "Carlos", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
    ],
  },
  {
    id: "downtown-art-walk",
    name: "Downtown Art Walk",
    date: "July 25, 2024",
    location: "Arts District",
    image: "https://placehold.co/400x200.png",
    hint: "art gallery",
    friendsAttending: [],
  },
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
];

const categories = ["Music", "Sports", "Art", "Tech", "Food", "Outdoors", "Comedy", "Workshops"];


export default function ExplorePage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">
              <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search for events..." className="pl-10" />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Filter Events</SheetTitle>
                        <SheetDescription>
                            Refine your search to find the perfect event.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-6">
                        <div className="space-y-4">
                            <Label className="font-semibold">Sort by</Label>
                             <RadioGroup defaultValue="relevance">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="relevance" id="r1" />
                                    <Label htmlFor="r1">Relevance</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="date" id="r2" />
                                    <Label htmlFor="r2">Date</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="popularity" id="r3" />
                                    <Label htmlFor="r3">Popularity</Label>
                                </div>
                             </RadioGroup>
                        </div>
                        <div className="space-y-4">
                            <Label className="font-semibold">Price</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-free" />
                                <Label htmlFor="price-free">Free</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="price-paid" />
                                <Label htmlFor="price-paid">Paid</Label>
                            </div>
                        </div>
                         <div className="space-y-4">
                            <Label className="font-semibold">Date</Label>
                             <RadioGroup defaultValue="all">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="d1" />
                                    <Label htmlFor="d1">Anytime</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="today" id="d2" />
                                    <Label htmlFor="d2">Today</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="weekend" id="d3" />
                                    <Label htmlFor="d3">This Weekend</Label>
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="month" id="d4" />
                                    <Label htmlFor="d4">This Month</Label>
                                </div>
                             </RadioGroup>
                        </div>
                    </div>
                </SheetContent>
              </Sheet>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Discover Events</h1>
            <p className="text-muted-foreground">Find your next great experience from our curated list of events.</p>
        </div>
        
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Top Categories</h2>
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <Button key={category} variant="outline">{category}</Button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreEvents.map((event, index) => (
                <EventCard key={index} event={event} />
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
