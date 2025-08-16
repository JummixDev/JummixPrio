
'use client';

import React from 'react';
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

type Event = {
    id: string;
    name: string;
    date: string;
    location: string;
    price: number;
    isFree: boolean;
    image: string;
    hint: string;
    description: string;
    organizer: {
      name: string;
      avatar: string;
      hint: string;
    };
    attendees: { name: string; avatar: string; hint: string }[];
    gallery: { src: string; hint: string }[];
};


type EventDetailClientProps = {
  event: Event;
};


export function EventDetailClient({ event }: EventDetailClientProps) {
    const { toast } = useToast();
    const [isAttending, setIsAttending] = React.useState(false);

    const handleActionClick = (action: string) => {
        toast({
            title: `${action}!`,
            description: `You've ${action.toLowerCase().slice(0,-1)}ed ${event.name}.`,
        });
    };

    const handleAttendClick = () => {
        setIsAttending(true);
        toast({
            title: "You're going!",
            description: `You are now attending ${event.name}.`,
        });
    }

  return (
    <div>
        <div className="relative w-full h-[40vh] max-h-[500px]">
            <Image
                src={event.image}
                alt={event.name}
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
                                <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary"/>{event.date}</span>
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
                                {event.gallery.map((photo, index) => (
                                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                                        <Image src={photo.src} alt={`Gallery photo ${index + 1}`} layout='fill' objectFit='cover' data-ai-hint={photo.hint} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                     {/* Map Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                                <p className="text-muted-foreground">Map placeholder</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
                     <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-around">
                                <Button variant="ghost" onClick={() => handleActionClick('Liked')}>
                                    <Heart className="mr-2" /> Like
                                </Button>
                                <Button variant="ghost" onClick={() => handleActionClick('Saved')}>
                                    <Bookmark className="mr-2" /> Save
                                </Button>
                                <Button variant="ghost" onClick={() => handleActionClick('Shared')}>
                                    <Share2 className="mr-2" /> Share
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline">
                                {isAttending ? "You are going!" : (event.isFree ? "Attend for Free" : `Tickets from $${event.price}`)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isAttending ? (
                                <Button disabled className="w-full">
                                    <CheckCircle className="mr-2" /> Attending
                                </Button>
                            ) : event.isFree ? (
                                 <Button onClick={handleAttendClick} className="w-full">
                                    <PlusCircle className="mr-2" /> RSVP Now
                                </Button>
                            ) : (
                                <Button onClick={handleAttendClick} className="w-full">
                                    <Ticket className="mr-2" /> Get Tickets
                                </Button>
                            )}
                        </CardContent>

                        <Separator className="my-4"/>

                        <CardContent>
                             <h3 className="font-semibold text-center mb-4">{event.attendees.length} people are going</h3>
                             <div className="flex justify-center -space-x-2">
                                {event.attendees.map(friend => (
                                    <Avatar key={friend.name} className="h-12 w-12 border-2 border-background">
                                        <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint={friend.hint}/>
                                        <AvatarFallback>{friend.name.substring(0,1)}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        </CardContent>

                         <Separator className="my-4"/>

                         <CardContent>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={event.organizer.avatar} data-ai-hint={event.organizer.hint} />
                                    <AvatarFallback>{event.organizer.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-muted-foreground">Organized by</p>
                                    <p className="font-bold">{event.organizer.name}</p>
                                </div>
                            </div>
                         </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
