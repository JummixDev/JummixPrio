
'use client';

import { ArrowLeft, Loader2, QrCode, Ticket, Clock, Wallet, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type Booking = {
  id: string;
  eventId: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventImage: string;
  eventHint: string;
  eventPrice: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
};

// A simple SVG to represent a QR code for placeholder purposes
const QrCodePlaceholder = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect width="100" height="100" fill="#FFFFFF"/>
    <rect x="10" y="10" width="25" height="25" fill="#000000"/>
    <rect x="15" y="15" width="15" height="15" fill="#FFFFFF"/>
    <rect x="17.5" y="17.5" width="10" height="10" fill="#000000"/>
    <rect x="65" y="10" width="25" height="25" fill="#000000"/>
    <rect x="70" y="15" width="15" height="15" fill="#FFFFFF"/>
    <rect x="72.5" y="17.5" width="10" height="10" fill="#000000"/>
    <rect x="10" y="65" width="25" height="25" fill="#000000"/>
    <rect x="15" y="70" width="15" height="15" fill="#FFFFFF"/>
    <rect x="17.5" y="72.5" width="10" height="10" fill="#000000"/>
    <path d="M40 40 H50 V50 H40Z M55 40 H65 V50 H55Z M40 55 H50 V65 H40Z M55 55 H65 V65 H55Z M70 55 H80 V65 H70Z M85 55 H90 V65 H85Z M40 70 H50 V80 H40Z M55 70 H65 V80 H55Z M70 70 H80 V80 H70Z M85 70 H90 V80 H85Z M40 85 H50 V90 H40Z M55 85 H65 V90 H55Z M70 85 H80 V90 H70Z M85 85 H90 V90 H85Z M45 10 H55 V20 H45Z M45 25 H55 V35 H45Z" fill="#000000" />
  </svg>
);

const statusConfig = {
    pending: { label: 'Request Pending', icon: Clock, color: 'bg-yellow-500' },
    approved: { label: 'Approved - Awaiting Payment', icon: Wallet, color: 'bg-blue-500' },
    paid: { label: 'Ticket Confirmed', icon: CheckCircle, color: 'bg-green-600' },
    rejected: { label: 'Request Declined', icon: XCircle, color: 'bg-red-500' },
}

const BookingCard = ({ booking }: { booking: Booking }) => {
    const config = statusConfig[booking.status];
    return (
        <Card className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
                 <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 relative">
                    <Image 
                        src={booking.eventImage}
                        alt={booking.eventName}
                        layout='fill'
                        objectFit='cover'
                        className="opacity-20"
                        data-ai-hint={booking.eventHint}
                    />
                    {booking.status === 'paid' ? (
                        <div className="w-3/4 h-3/4 bg-white p-2 rounded-lg">
                             <QrCodePlaceholder />
                        </div>
                    ) : (
                        <div className="z-10 text-center">
                            <config.icon className="w-12 h-12 mx-auto text-foreground/80 mb-2"/>
                            <p className="font-semibold">{config.label}</p>
                        </div>
                    )}
                 </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground">Event</p>
                <CardTitle className="font-headline mb-2">{booking.eventName}</CardTitle>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold truncate">{booking.eventLocation}</p>
                </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                 {booking.status === 'approved' && (
                     <Button className="w-full" asChild><Link href={`/event/${booking.eventId}`}>Pay Now (${booking.eventPrice})</Link></Button>
                 )}
                 {booking.status === 'paid' && (
                      <Button className="w-full" variant="outline" asChild><Link href={`/event/${booking.eventId}`}>View Event</Link></Button>
                 )}
                 {booking.status === 'pending' && (
                      <Button className="w-full" variant="secondary" disabled>Waiting for Host</Button>
                 )}
            </CardFooter>
        </Card>
    )
}

export default function MyTicketsPage() {
  const { user, loading: authLoading, userData } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        // Sort by date, newest first
        fetchedBookings.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        setBookings(fetchedBookings);
        setLoading(false);
    });

    return () => unsubscribe();

  }, [user]);

  if (authLoading || loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold font-headline text-primary">Loading Your Bookings...</h1>
        </div>
    );
  }

  return (
    <div className="bg-secondary/20 min-h-screen">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-4">My Bookings</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-16 pb-24">
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Ticket className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground mb-6">When you book an event, it will appear here.</p>
            <Button asChild>
              <Link href="/explore">Explore Events</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
