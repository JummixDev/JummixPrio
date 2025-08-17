
'use client';

import { Button } from '@/components/ui/button';
import { Menu, MessageSquare, User, Settings, LayoutDashboard, Shield, HelpCircle, Info, Mail, LogOut, Loader2, Ticket, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { GlobalSearch } from './GlobalSearch';

// Pages where the global header should NOT be shown
const noHeaderPages = ['/', '/reset-password'];

export function GlobalHeader() {
  const { user, loading, signOut, userData } = useAuth();
  const pathname = usePathname();

  const isAdmin = user?.email === 'service@jummix.com';
  const isVerifiedHost = userData?.isVerifiedHost || false;
  const hostApplicationStatus = userData?.hostApplicationStatus;
  const userProfileLink = `/profile/me`;

  if (loading) {
    return null; // Or a slim loading bar
  }

  // Hide header on specific pages or if the user is not logged in (except for the landing page)
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
            <Clock className="mr-2 h-5 w-5" /> Bewerbung ausstehend...
        </Button>
      );
    }
    return (
      <SheetClose asChild>
        <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
          <Link href="/host/apply-verification">
            <LayoutDashboard className="mr-2 h-5 w-5" /> Als Host bewerben
          </Link>
        </Button>
      </SheetClose>
    );
  };
  
  return (
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
            </Link>
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <GlobalSearch />
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
                                <Ticket className="mr-2 h-5 w-5" /> My Tickets
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
                                <Info className="mr-2 h-5 w-5" /> Über uns
                            </Link>
                            </Button>
                        </SheetClose>
                         <SheetClose asChild>
                            <Button asChild variant="ghost" className="w-full justify-start text-base py-6">
                            <Link href="/contact">
                                <Mail className="mr-2 h-5 w-5" /> Kontakt
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
  )
}
