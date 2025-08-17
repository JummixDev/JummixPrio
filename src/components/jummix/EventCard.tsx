

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bookmark, Calendar, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { toggleEventInteraction } from "@/app/actions";
import { useState, useEffect } from "react";


type EventCardProps = {
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    image: string;
    hint: string;
    // This is now coming from the DB and can be optional
    attendees?: { name: string; avatar: string, hint: string, username: string }[];
  };
};

export function EventCard({ event }: EventCardProps) {
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (userData) {
      setIsLiked(userData.likedEvents?.includes(event.id));
      setIsSaved(userData.savedEvents?.includes(event.id));
    }
  }, [userData, event.id]);

  const friendsAttending = event.attendees || [];

  const handleInteraction = async (e: React.MouseEvent, type: 'liked' | 'saved') => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
        toast({ variant: 'destructive', title: 'Please sign in', description: 'You must be logged in to interact with events.' });
        return;
    }
    
    const result = await toggleEventInteraction(user.uid, event.id, type);

    if (result.success) {
        const actionVerb = type === 'liked' ? 'Liked' : 'Saved';
        const pastTenseVerb = type === 'liked' ? 'liked' : 'saved';
        
        if (type === 'liked') setIsLiked(result.newState);
        if (type === 'saved') setIsSaved(result.newState);

        toast({
            title: `Event ${result.newState ? actionVerb : 'Un' + pastTenseVerb}!`,
            description: `You've ${result.newState ? '' : 'un'}${pastTenseVerb} ${event.name}.`,
        });
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  }
  

  const handleRsvpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
        title: "RSVP'd!",
        description: `You are now attending ${event.name}.`,
    });
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC', // Ensure date is not affected by client's timezone
  });


  return (
    <Link href={`/event/${event.id}`} className="block">
        <Card className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        <CardHeader className="p-0 relative">
            <Image
            src={event.image || 'https://placehold.co/400x200.png'}
            alt={event.name || 'Event image'}
            width={400}
            height={200}
            data-ai-hint={event.hint}
            className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-colors" />
            <div className="absolute top-2 right-2 flex gap-2">
                <Button onClick={(e) => handleInteraction(e, 'liked')} size="icon" variant="ghost" className={`text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 transition-transform active:scale-90 hover:scale-110 ${isLiked ? 'bg-red-500/80' : ''}`}>
                    <Heart className="w-4 h-4" />
                </Button>
                <Button onClick={(e) => handleInteraction(e, 'saved')} size="icon" variant="ghost" className={`text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 transition-transform active:scale-90 hover:scale-110 ${isSaved ? 'bg-blue-500/80' : ''}`}>
                    <Bookmark className="w-4 h-4" />
                </Button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 bg-black/50 backdrop-blur-sm">
                <div className="text-center text-white">
                    {friendsAttending.length > 0 ? (
                    <>
                        <p className="font-semibold mb-2">Friends Attending</p>
                        <div className="flex justify-center -space-x-2">
                            {friendsAttending.slice(0, 3).map(friend => (
                                <Avatar key={friend.username} className="h-10 w-10 border-2 border-primary">
                                    <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint={friend.hint}/>
                                    <AvatarFallback>{friend.name.substring(0,1)}</AvatarFallback>
                                </Avatar>
                            ))}
                            {friendsAttending.length > 3 && (
                                <Avatar className="h-10 w-10 border-2 border-primary">
                                    <AvatarFallback>+{friendsAttending.length - 3}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </>
                    ) : (
                    <p className="font-semibold">Be the first of your friends to go!</p>
                    )}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <CardTitle className="font-headline text-lg mb-2 truncate">{event.name}</CardTitle>
            <div className="text-muted-foreground text-sm space-y-1">
                <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {formattedDate}</p>
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {event.location}</p>
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button onClick={handleRsvpClick} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-transform active:scale-95">RSVP Now</Button>
        </CardFooter>
        </Card>
    </Link>
  );
}
    