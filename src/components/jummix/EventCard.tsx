
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
import { cn } from "@/lib/utils";


type EventCardProps = {
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    image: string;
    hint: string;
    price: number;
    isFree: boolean;
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
      setIsLiked(userData.likedEvents?.includes(event.id) ?? false);
      setIsSaved(userData.savedEvents?.includes(event.id) ?? false);
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
  }
  
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC', // Ensure date is not affected by client's timezone
  });


  return (
    <Link href={`/event/${event.id}`} className="block h-full">
        <Card className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 h-full flex flex-col bg-card">
        <CardHeader className="p-0 relative">
            <Image
            src={event.image || 'https://picsum.photos/seed/event-default/400/200'}
            alt={event.name || 'Event image'}
            width={400}
            height={200}
            data-ai-hint={event.hint}
            className="w-full h-32 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
                <Button onClick={(e) => handleInteraction(e, 'liked')} size="icon" variant="ghost" className={cn("text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 transition-transform active:scale-90 hover:scale-110", isLiked && 'bg-red-500/80 text-white')}>
                    <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                </Button>
                <Button onClick={(e) => handleInteraction(e, 'saved')} size="icon" variant="ghost" className={cn("text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 transition-transform active:scale-90 hover:scale-110", isSaved && 'bg-blue-500/80 text-white')}>
                    <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
                </Button>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <div className="flex -space-x-2">
                    {friendsAttending.slice(0, 3).map(friend => (
                        <Avatar key={friend.username} className="h-6 w-6 border-2 border-primary">
                            <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint={friend.hint}/>
                            <AvatarFallback>{friend.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                 <div className="bg-background/80 text-foreground text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    {event.isFree ? "FREE" : `$${event.price.toFixed(2)}`}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <CardTitle className="font-headline text-base leading-tight mb-2 truncate group-hover:text-primary">{event.name}</CardTitle>
            <div className="text-muted-foreground text-xs space-y-1">
                <p className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" /> {formattedDate}</p>
                <p className="flex items-center"><MapPin className="w-3 h-3 mr-1.5" /> {event.location}</p>
            </div>
        </CardContent>
        </Card>
    </Link>
  );
}
