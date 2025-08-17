
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const mockPost = {
    user: {
        name: "Jenna Smith",
        username: "jennasmith",
        avatar: "https://placehold.co/40x40.png",
        hint: "woman portrait"
    },
    time: "2h ago",
    content: "Had the most amazing time at the Summer Music Fest! The vibes were just incredible. Can't wait for next year! 🎶✨",
    image: {
        src: "https://placehold.co/600x400.png",
        hint: "festival crowd"
    },
    likes: 124,
    comments: 12,
}

export function UserPostsFeed() {
  return (
    <Card className="transition-transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">Community Feed</CardTitle>
            <CardDescription>See what's happening in your community.</CardDescription>
        </div>
         <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
            <Link href="/feed">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                 <Avatar>
                    <AvatarImage src={mockPost.user.avatar} alt={mockPost.user.name} data-ai-hint={mockPost.user.hint}/>
                    <AvatarFallback>{mockPost.user.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{mockPost.user.name}</p>
                    <p className="text-sm text-muted-foreground">@{mockPost.user.username} &middot; {mockPost.time}</p>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="mb-4">{mockPost.content}</p>
                {mockPost.image && (
                    <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                        <Image src={mockPost.image.src} alt="Post image" layout="fill" objectFit="cover" data-ai-hint={mockPost.image.hint} />
                    </div>
                )}
                <div className="flex gap-4 text-muted-foreground">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Heart className="w-4 h-4" /> {mockPost.likes}
                    </Button>
                     <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> {mockPost.comments}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
