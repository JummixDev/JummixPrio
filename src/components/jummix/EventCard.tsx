import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Calendar, Heart, MapPin } from "lucide-react";
import Image from "next/image";

type EventCardProps = {
  event: {
    name: string;
    date: string;
    location: string;
    image: string;
    hint: string;
    friendsAttending: { name: string; avatar: string, hint: string }[];
  };
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Image
          src={event.image}
          alt={event.name}
          width={400}
          height={200}
          data-ai-hint={event.hint}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-colors" />
        <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 transition-transform active:scale-90 hover:scale-110">
                <Heart className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 transition-transform active:scale-90 hover:scale-110">
                <Bookmark className="w-4 h-4" />
            </Button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 bg-black/50 backdrop-blur-sm">
            <div className="text-center text-white">
                {event.friendsAttending.length > 0 ? (
                  <>
                    <p className="font-semibold mb-2">Friends Attending</p>
                    <div className="flex justify-center -space-x-2">
                        {event.friendsAttending.slice(0, 3).map(friend => (
                            <Avatar key={friend.name} className="h-10 w-10 border-2 border-primary">
                                <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint={friend.hint}/>
                                <AvatarFallback>{friend.name.substring(0,1)}</AvatarFallback>
                            </Avatar>
                        ))}
                        {event.friendsAttending.length > 3 && (
                            <Avatar className="h-10 w-10 border-2 border-primary">
                                <AvatarFallback>+{event.friendsAttending.length - 3}</AvatarFallback>
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
      <CardContent className="p-4">
        <CardTitle className="font-headline text-lg mb-2 truncate">{event.name}</CardTitle>
        <div className="text-muted-foreground text-sm space-y-1">
            <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {event.date}</p>
            <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {event.location}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-transform active:scale-95">RSVP Now</Button>
      </CardFooter>
    </Card>
  );
}
