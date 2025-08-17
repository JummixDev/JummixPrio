
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const mockReels = [
  { user: { name: "Carlos Ray", avatar: "https://placehold.co/100x100.png", hint: "man portrait" }, event: "Summer Music Fest" },
  { user: { name: "Alex Doe", avatar: "https://placehold.co/100x100.png", hint: "person portrait" }, event: "Downtown Art Walk" },
  { user: { name: "Aisha Khan", avatar: "https://placehold.co/100x100.png", hint: "woman face" }, event: "Culinary Workshop" },
  { user: { name: "Jenna Smith", avatar: "https://placehold.co/100x100.png", hint: "woman portrait" }, event: "Tech Innovators Summit" },
  { user: { name: "David Lee", avatar: "https://placehold.co/100x100.png", hint: "man face" }, event: "City Marathon" },
];

export function EventReels() {
  const { userData } = useAuth();
  const { toast } = useToast();
  const isAdmin = userData?.email === 'service@jummix.com';
  const isVerifiedHost = userData?.isVerifiedHost || false;
  
  const handleAddStory = () => {
      toast({
          title: "Feature in Kürze verfügbar",
          description: "Die Möglichkeit, Stories hinzuzufügen, wird bald implementiert.",
      })
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">Event Stories</CardTitle>
            <CardDescription>Exklusive Highlights von verifizierten Hosts.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
                 {(isVerifiedHost || isAdmin) && (
                    <Link href="/story/create" className="flex flex-col items-center gap-2 cursor-pointer text-primary hover:text-primary/80">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary">
                            <PlusCircle className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-semibold">Add Story</span>
                    </Link>
                )}
                {mockReels.map((reel, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 text-center flex-shrink-0 cursor-pointer group">
                       <div className="relative w-16 h-16">
                            <Avatar className="w-full h-full border-2 border-transparent group-hover:border-primary transition-colors">
                                <AvatarImage src={reel.user.avatar} alt={reel.user.name} data-ai-hint={reel.user.hint}/>
                                <AvatarFallback>{reel.user.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-card ring-purple-500 group-hover:ring-purple-400 transition-all"/>
                       </div>
                        <span className="text-xs font-medium w-16 truncate">{reel.user.name}</span>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
