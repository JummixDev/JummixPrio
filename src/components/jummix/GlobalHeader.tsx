
'use client';

import { Button } from '@/components/ui/button';
import { Menu, MessageSquare, User, Settings, LayoutDashboard, Shield, HelpCircle, Info, Mail, LogOut, Loader2, Ticket, Clock, Library, Compass, Trophy, Award, Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { GlobalSearch } from './GlobalSearch';

// Pages where the global header should NOT be shown
const noHeaderPages = ['/', '/reset-password', '/onboarding'];

export function GlobalHeader() {
  const { user, loading, signOut, userData } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = user?.email === 'service@jummix.com';
  const isVerifiedHost = userData?.isVerifiedHost || false;
  const hostApplicationStatus = userData?.hostApplicationStatus;
  const userProfileLink = `/profile/me`;


  if (loading) {
    return null; // Or a slim loading bar
  }

  // Hide header on specific pages or if the user is not logged in
  if (!user || noHeaderPages.includes(pathname)) {
    return null;
  }

  const renderHostLink = () => {
    if (isAdmin || isVerifiedHost) {
      return (
        <SheetClose asChild>
          <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
            <Link href="/host/dashboard">
              <LayoutDashboard className="mr-2 h-5 w-5" /> Host Dashboard
            </Link>
          </Button>
        </SheetClose>
      );
    }
    if (hostApplicationStatus === 'pending') {
      return (
         <Button variant="ghost" className="w-full justify-start text-base py-6 text-muted-foreground cursor-not-allowed">
            <Clock className="mr-2 h-5 w-5" /> Application pending...
        </Button>
      );
    }
    return (
      <SheetClose asChild>
        <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
          <Link href="/host/apply-verification">
            <LayoutDashboard className="mr-2 h-5 w-5" /> Apply to be a Host
          </Link>
        </Button>
      </SheetClose>
    );
  };
  
  return (
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
            </Link>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-2">
               <GlobalSearch />
               <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/explore">
                  <Compass/>
                  Explore
                </Link>
              </Button>
               <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/chats">
                  <MessageSquare />
                  Chats
                </Link>
              </Button>

               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userData?.photoURL || undefined} alt={userData?.displayName}/>
                        <AvatarFallback>
                            {userData?.displayName?.substring(0, 2) || <User/>}
                        </AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                    <SheetHeader className="p-6 pb-4 border-b">
                        <SheetTitle>
                           Menu
                        </SheetTitle>
                    </SheetHeader>
                  <div className="flex-grow overflow-y-auto">
                    <nav className="p-4 space-y-1">
                        <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href={userProfileLink}>
                                <User className="mr-2 h-5 w-5" /> My Profile
                            </Link>
                            </Button>
                        </SheetClose>
                         <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href="/my-tickets">
                                <Ticket className="mr-2 h-5 w-5" /> My Bookings
                            </Link>
                            </Button>
                        </SheetClose>
                         <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href="/my-events">
                                <Library className="mr-2 h-5 w-5" /> My Events
                            </Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                                <Link href="/achievements">
                                    <Trophy className="mr-2 h-5 w-5" /> Achievements
                                </Link>
                            </Button>
                        </SheetClose>
                        
                         {isAdmin && (
                            <SheetClose asChild>
                                <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                                <Link href="/admin">
                                    <Shield className="mr-2 h-5 w-5" /> Admin Dashboard
                                </Link>
                                </Button>
                            </SheetClose>
                        )}
                        
                        {renderHostLink()}

                        <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href="/settings">
                                <Settings className="mr-2 h-5 w-5" /> Settings
                            </Link>
                            </Button>
                        </SheetClose>
                        <Separator />
                         <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href="/about">
                                <Info className="mr-2 h-5 w-5" /> About Us
                            </Link>
                            </Button>
                        </SheetClose>
                         <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href="/contact">
                                <Mail className="mr-2 h-5 w-5" /> Contact
                            </Link>
                            </Button>
                        </SheetClose>
                         <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href="/faq">
                                <HelpCircle className="mr-2 h-5 w-5" /> FAQ
                            </Link>
                            </Button>
                        </SheetClose>
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
  );
}
