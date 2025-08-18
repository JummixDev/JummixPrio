

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

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

const mockFeed = [
    mockPost,
    {
         user: {
            name: "Carlos Ray",
            username: "carlosray",
            avatar: "https://placehold.co/40x40.png",
            hint: "man portrait"
        },
        time: "5h ago",
        content: "Just announced a new Tech Innovators Summit. Who's coming? #tech #conference",
        image: null,
        likes: 88,
        comments: 23,
    },
    {
         user: {
            name: "Aisha Khan",
            username: "aishakhan",
            avatar: "https://placehold.co/40x40.png",
            hint: "woman face"
        },
        time: "1d ago",
        content: "My pasta-making workshop was a huge success! So proud of everyone who participated. Look at these beautiful creations!",
        image: {
            src: "https://placehold.co/600x400.png",
            hint: "plates of pasta"
        },
        likes: 251,
        comments: 45,
    }
];

const PostCard = ({ post }: { post: typeof mockPost }) => (
     <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Link href={`/profile/${post.user.username}`} className="contents">
                <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} data-ai-hint={post.user.hint}/>
                <AvatarFallback>{post.user.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold hover:underline">{post.user.name}</p>
                    <p className="text-sm text-muted-foreground">@{post.user.username} &middot; {post.time}</p>
                </div>
            </Link>
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
            {post.image && (
                <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                    <Image src={post.image.src} alt="Post image" layout="fill" objectFit="cover" data-ai-hint={post.image.hint} />
                </div>
            )}
            <div className="flex gap-4 text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" /> {post.likes}
                </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> {post.comments}
                </Button>
            </div>
        </CardContent>
    </Card>
);

export function UserPostsFeed() {
  return (
    <Dialog>
    <Card className="transition-transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline">Community Feed</CardTitle>
            <CardDescription>See what's happening in your community.</CardDescription>
        </div>
        <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </Button>
        </DialogTrigger>
      </CardHeader>
      <CardContent>
        <PostCard post={mockPost} />
      </CardContent>
    </Card>
    <DialogContent className="max-w-2xl">
        <DialogHeader>
            <DialogTitle className="font-headline">Full Community Feed</DialogTitle>
            <DialogDescription>Bleib auf dem Laufenden mit den neuesten Posts aus der Community.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] border-t">
            <div className="space-y-6 p-4">
                {mockFeed.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </div>
        </ScrollArea>
    </DialogContent>
    </Dialog>
  );
}
