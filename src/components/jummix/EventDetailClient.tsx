
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  Heart,
  Bookmark,
  PlusCircle,
  Ticket,
  CheckCircle,
  Loader2,
  Clock,
  Wallet,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { EventCard } from './EventCard';
import { Timestamp, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { createCheckoutSession, toggleEventInteraction, requestToBook } from '@/app/actions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type Event = {
    id: string;
    name: string;
    date: Timestamp | string; // Can be a Timestamp from Firestore or a string
    location: string;
    price: number;
    isFree: boolean;
    image: string;
    hint: string;
    description: string;
    organizer?: {
      name: string;
      avatar: string;
      hint: string;
      username: string;
    };
    attendees?: { name: string; avatar: string; hint: string, username: string }[];
    gallery?: { src: string; hint: string }[];
    lat?: number;
    lon?: number;
};

type BookingStatus = 'idle' | 'pending' | 'approved' | 'paid' | 'rejected';

type EventDetailClientProps = {
  event: Event;
};

// Helper function to format date from string or Timestamp
const formatDate = (date: Timestamp | string) => {
    const d = typeof date === 'string' ? new Date(date) : date.toDate();
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
    });
}

function getCirclePath(lat: number, lon: number, radiusMeters: number) {
    const earthRadius = 6378137;
    const points = 64;
    const path = [];
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * 360;
        const bearing = angle * Math.PI / 180;
        const latRad = lat * Math.PI / 180;
        const lonRad = lon * Math.PI / 180;

        const distFrac = radiusMeters / earthRadius;

        const newLatRad = Math.asin(Math.sin(latRad) * Math.cos(distFrac) + Math.cos(latRad) * Math.sin(distFrac) * Math.cos(bearing));
        let newLonRad = lonRad + Math.atan2(Math.sin(bearing) * Math.sin(distFrac) * Math.cos(latRad), Math.cos(distFrac) - Math.sin(latRad) * Math.sin(newLatRad));
        
        // Normalize to -180..+180
        newLonRad = (newLonRad + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

        path.push(`${newLatRad * 180 / Math.PI},${newLonRad * 180 / Math.PI}`);
    }
    path.push(path[0]); // Close the circle
    return path.join('|');
}


export function EventDetailClient({ event }: EventDetailClientProps) {
    const { user, userData } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    useEffect(() => {
        if (userData) {
          setIsLiked(userData.likedEvents?.includes(event.id) ?? false);
          setIsSaved(userData.savedEvents?.includes(event.id) ?? false);
        }
        
        if (user && event.id) {
            const bookingDocRef = doc(db, "bookings", `${user.uid}_${event.id}`);
            const unsubscribe = onSnapshot(bookingDocRef, (doc) => {
                 if (doc.exists()) {
                    setBookingStatus(doc.data().status as BookingStatus);
                } else {
                    setBookingStatus('idle');
                }
            }, (error) => {
                 console.error("Error with booking status snapshot listener:", error);
                 setBookingStatus('idle');
            });

            return () => unsubscribe();
        }

    }, [userData, event.id, user]);


    const handleInteraction = async (type: 'liked' | 'saved') => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Please sign in', description: 'You must be logged in to interact with events.' });
            return;
        }

        // Optimistic UI update
        if (type === 'liked') setIsLiked(prev => !prev);
        if (type === 'saved') setIsSaved(prev => !prev);
        
        const result = await toggleEventInteraction(user.uid, event.id, type);

        if (!result.success) {
            // Revert UI on failure
            if (type === 'liked') setIsLiked(prev => !prev);
            if (type === 'saved') setIsSaved(prev => !prev);
            
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };
    
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.name,
                    text: `Check out this event: ${event.name}`,
                    url: window.location.href,
                });
                toast({ title: "Shared successfully!" });
            } catch (error) {
                // Don't show an error if the user cancels the share dialog
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Error sharing:', error);
                toast({ variant: "destructive", title: "Could not share", description: "Something went wrong while trying to share."});
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link Copied!", description: "The event link has been copied to your clipboard." });
        }
    };

    const handleRequestClick = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not logged in', description: 'Please log in to request a spot.' });
            return;
        }
        setIsProcessing(true);
        const result = await requestToBook(user.uid, event.id, event.organizer?.username);

        if (result.success) {
            toast({ title: "Request Sent!", description: "The host has been notified of your request." });
            setBookingStatus('pending'); // Manually update status after successful request
        } else {
            if (result.error === 'onboarding_required') {
                toast({
                    variant: 'destructive',
                    title: "Profile Incomplete",
                    description: "Please complete your profile before booking events.",
                    action: <Button onClick={() => router.push('/onboarding')}>Complete Profile</Button>,
                });
            } else {
                toast({ variant: 'destructive', title: "Request Failed", description: result.error });
            }
        }
        setIsProcessing(false);
    }
    
    const handlePaymentClick = async () => {
         if (!user) {
            toast({ variant: 'destructive', title: 'Not logged in', description: 'Please log in to purchase tickets.' });
            return;
        }
        setIsProcessing(true);
        const result = await createCheckoutSession(user.uid, event.id);
        if (result.success && result.url) {
            window.location.href = result.url;
        } else {
            toast({ variant: 'destructive', title: 'Payment Error', description: result.error || 'Could not initiate the payment process. Please try again.'});
            setIsProcessing(false);
        }
    }
    
    const formattedDate = formatDate(event.date);
    
    const AttendButton = () => {
        switch (bookingStatus) {
            case 'pending':
                return (
                    <Button disabled className="w-full">
                        <Clock className="mr-2" /> Request Sent
                    </Button>
                );
            case 'approved':
                return (
                    <Button onClick={handlePaymentClick} disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700">
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2" />}
                        Pay Now to Confirm
                    </Button>
                );
            case 'paid':
                return (
                    <Button disabled className="w-full">
                        <CheckCircle className="mr-2" /> Confirmed
                    </Button>
                );
            case 'rejected':
                 return (
                    <Button disabled variant="destructive" className="w-full">
                        Request Declined by Host
                    </Button>
                );
            default: // idle
                return (
                    <Button onClick={handleRequestClick} disabled={isProcessing} className="w-full transition-transform active:scale-95">
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2" />}
                        Request to Book
                    </Button>
                );
        }
    };

    const mapSrc = React.useMemo(() => {
        if (!mapsApiKey || !event.lat || !event.lon) return null;
        
        const center = `${event.lat},${event.lon}`;
        // The circle path is encoded for the URL
        const circlePath = encodeURIComponent(`fillcolor:0x1976D233|color:0x1976D200|weight:1|${getCirclePath(event.lat, event.lon, 400)}`);
        
        return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=15&size=600x400&maptype=roadmap&path=${circlePath}&key=${mapsApiKey}`;
    }, [mapsApiKey, event.lat, event.lon]);


  return (
    <div>
        <div className="relative w-full h-[40vh] max-h-[500px]">
            <Image
                src={event.image || 'https://placehold.co/1200x400.png'}
                alt={event.name || 'Event image'}
                layout="fill"
                objectFit="cover"
                data-ai-hint={event.hint}
                className="brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>

        <div className="container mx-auto -mt-20 relative z-10 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Info Card */}
                    <Card className="overflow-hidden shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-4xl font-headline">{event.name}</CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base pt-2">
                                <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary"/>{formattedDate}</span>
                                <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/>{event.location}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="prose prose-stone dark:prose-invert max-w-none">
                                <h3 className='font-headline'>About this Event</h3>
                                <p>{event.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gallery Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Event Gallery</CardTitle>
                            <CardDescription>Photos from the event. Add your own!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {event.gallery && event.gallery.length > 0 ? (
                                    event.gallery.map((photo, index) => (
                                        <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                                            <Image src={photo.src} alt={`Gallery photo ${index + 1}`} layout='fill' objectFit='cover' data-ai-hint={photo.hint} />
                                        </div>
                                    ))
                                ) : (
                                  <p className='text-muted-foreground text-sm'>No photos yet. Be the first to add one!</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                     {/* Map Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
                               {mapSrc ? (
                                    <Image
                                        src={mapSrc}
                                        alt={`Map of ${event.location}`}
                                        width={600}
                                        height={400}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <p className="text-muted-foreground p-4 text-center">Google Maps API key is missing, event coordinates are not available, or the API is not enabled. Please check your configuration.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                     {/* Similar Events */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Similar Events</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <p className='text-muted-foreground text-sm'>Similar events would be displayed here.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
                     <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-around">
                                <Button variant="ghost" onClick={() => handleInteraction('liked')} className={`transition-transform active:scale-90 ${isLiked ? 'text-red-500' : ''}`}>
                                    <Heart className="mr-2" /> Like
                                </Button>
                                <Button variant="ghost" onClick={() => handleInteraction('saved')} className={`transition-transform active:scale-90 ${isSaved ? 'text-blue-500' : ''}`}>
                                    <Bookmark className="mr-2" /> Save
                                </Button>
                                <Button variant="ghost" onClick={handleShare} className="transition-transform active:scale-90">
                                    <Share2 className="mr-2" /> Share
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline">
                                {bookingStatus === 'paid' ? "You're going!" : (event.isFree ? "Attend for Free" : `Tickets from $${event.price}`)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <AttendButton />
                        </CardContent>

                        <Separator className="my-4"/>

                        <CardContent>
                             <h3 className="font-semibold text-center mb-4">{event.attendees ? event.attendees.length : 0} people are going</h3>
                             {event.attendees && event.attendees.length > 0 && (
                                <div className="flex justify-center -space-x-2">
                                    {event.attendees.map(friend => (
                                        <Link key={friend.username} href={`/profile/${friend.username}`}>
                                            <Avatar className="h-12 w-12 border-2 border-background hover:ring-2 hover:ring-primary transition-all">
                                                <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint={friend.hint}/>
                                                <AvatarFallback>{friend.name.substring(0,1)}</AvatarFallback>
                                            </Avatar>
                                        </Link>
                                    ))}
                                </div>
                             )}
                        </CardContent>

                        {event.organizer && (
                            <>
                            <Separator className="my-4"/>
                            <CardContent>
                                <Link href={`/hosts/${event.organizer.username}`} className="flex items-center gap-4 group">
                                    <Avatar className="w-12 w-12">
                                        <AvatarImage src={event.organizer.avatar} data-ai-hint={event.organizer.hint} />
                                        <AvatarFallback>{event.organizer.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Organized by</p>
                                        <p className="font-bold group-hover:underline group-hover:text-primary transition-colors">{event.organizer.name}</p>
                                    </div>
                                </Link>
                            </CardContent>
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}

    