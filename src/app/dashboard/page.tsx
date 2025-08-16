

'use client';

import { UserProfileCard } from "@/components/jummix/UserProfileCard";
import { Badges } from "@/components/jummix/Badges";
import { EventReels } from "@/components/jummix/EventReels";
import { LiveActivityFeed } from "@/components/jummix/LiveActivityFeed";
import { EventCard } from "@/components/jummix/EventCard";
import { Leaderboard } from "@/components/jummix/Leaderboard";
import { AIRecommender } from "@/components/jummix/AIRecommender";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Menu, MessageSquare, User, Settings, LayoutDashboard, Shield, HelpCircle, Info, Mail, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/jummix/Footer";
import { Separator } from "@/components/ui/separator";

// Mock data for upcoming events - will be replaced by backend data
const events = [
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
      { name: "Aisha", avatar: "https://placehold.co/40x40.png", hint: "woman face" },
      { name: "David", avatar: "https://placehold.co/40x40.png", hint: "man face" },
      { name: "Alex", avatar: "https://placehold.co/40x40.png", hint: "person portrait" },
    ],
  },
];


export default function DashboardPage() {
  const { user, loading, signOut, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const isAdmin = user?.email === 'service@jummix.com';
  // A user is a host if their data says so, OR if they are the master admin
  const isVerifiedHost = userData?.isVerifiedHost || isAdmin;


  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }

  const userProfileLink = `/profile/${user?.email?.split('@')[0] || 'me'}`;

  return (
    <div className="bg-background min-h-screen font-body flex flex-col">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
            </Link>
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search events or friends..." className="pl-10" />
              </div>
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
                        
                        {isVerifiedHost ? (
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
                        
                        {isAdmin && (
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                               <Link href="/admin">
                                <Shield className="mr-2 h-5 w-5" /> Admin Dashboard
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
