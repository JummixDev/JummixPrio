

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, CalendarCheck, Share2, UserPlus } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const activities = [
  {
    user: "Jenna Smith",
    userProfile: "/profile/jennasmith",
    avatar: "https://placehold.co/40x40.png",
    hint: "woman portrait",
    action: "RSVP'd to",
    target: "Summer Music Fest",
    targetLink: "/event/summer-music-fest",
    time: "2m ago",
    icon: <CalendarCheck className="w-4 h-4 text-accent" />,
  },
  {
    user: "Carlos Ray",
    userProfile: "/profile/carlosray",
    avatar: "https://placehold.co/40x40.png",
    hint: "man portrait",
    action: "is now connected with",
    target: "Maria Garcia",
    targetLink: "/profile/mariagarcia",
    time: "10m ago",
    icon: <UserPlus className="w-4 h-4 text-primary" />,
  },
];

const allActivities = [
    ...activities,
    {
        user: "Aisha Khan",
        userProfile: "/profile/aishakhan",
        avatar: "https://placehold.co/40x40.png",
        hint: "woman face",
        action: "shared a memory from",
        target: "The Color Run",
        targetLink: "#",
        time: "30m ago",
        icon: <Share2 className="w-4 h-4 text-purple-500" />,
      },
    {
        user: "Alex Doe",
        userProfile: "/profile/alexdoe",
        avatar: "https://placehold.co/40x40.png",
        hint: "person portrait",
        action: "RSVP'd to",
        target: "Tech Innovators Summit",
        targetLink: "/event/tech-innovators-summit",
        time: "1h ago",
        icon: <CalendarCheck className="w-4 h-4 text-accent" />,
    },
    {
        user: "David Lee",
        userProfile: "/profile/davidlee",
        avatar: "https://placehold.co/40x40.png",
        hint: "man face",
        action: "is now connected with",
        target: "Carlos Ray",
        targetLink: "/profile/carlosray",
        time: "2h ago",
        icon: <UserPlus className="w-4 h-4 text-primary" />,
    },
    {
        user: "Jenna Smith",
        userProfile: "/profile/jennasmith",
        avatar: "https://placehold.co/40x40.png",
        hint: "woman portrait",
        action: "shared a memory from",
        target: "Downtown Art Walk",
        targetLink: "/event/downtown-art-walk",
        time: "4h ago",
        icon: <Share2 className="w-4 h-4 text-purple-500" />,
    },
    {
        user: "Carlos Ray",
        userProfile: "/profile/carlosray",
        avatar: "https://placehold.co/40x40.png",
        hint: "man portrait",
        action: "RSVP'd to",
        target: "Culinary Workshop: Pasta Making",
        targetLink: "/event/culinary-workshop",
        time: "1d ago",
        icon: <CalendarCheck className="w-4 h-4 text-accent" />,
    },
]

export function LiveActivityFeed() {
  return (
    <Dialog>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">My Activities</CardTitle>
                    <CardDescription className="text-xs">Recent activities from your friends.</CardDescription>
                </div>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </DialogTrigger>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                {activities.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-4">
                    <Link href={activity.userProfile} passHref>
                        <Avatar className="w-10 h-10 border-2 border-secondary flex-shrink-0 cursor-pointer">
                            <AvatarImage src={activity.avatar} alt={activity.user} data-ai-hint={activity.hint} />
                            <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex-grow">
                        <p className="text-sm">
                            <Link href={activity.userProfile} passHref><span className="font-bold text-foreground hover:underline">{activity.user}</span></Link>{" "}
                            {activity.action}{" "}
                            <Link href={activity.targetLink} passHref><span className="font-semibold text-primary hover:underline">{activity.target}</span></Link>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        {activity.icon}
                        {activity.time}
                        </p>
                    </div>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-headline">Full Activity Feed</DialogTitle>
                <DialogDescription>Alle kürzlichen Aktivitäten von dir und deinen Freunden im Überblick.</DialogDescription>
            </DialogHeader>
             <ScrollArea className="h-96">
                <ul className="space-y-4 pr-4 pt-4">
                {allActivities.map((activity, index) => (
                    <li key={index} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50">
                     <Link href={activity.userProfile} passHref>
                        <Avatar className="w-12 h-12 border-2 border-secondary flex-shrink-0 cursor-pointer">
                            <AvatarImage src={activity.avatar} alt={activity.user} data-ai-hint={activity.hint} />
                            <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex-grow">
                        <p className="text-sm">
                            <Link href={activity.userProfile} passHref><span className="font-bold text-foreground hover:underline">{activity.user}</span></Link>{" "}
                            {activity.action}{" "}
                             <Link href={activity.targetLink} passHref><span className="font-semibold text-primary hover:underline">{activity.target}</span></Link>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        {activity.icon}
                        {activity.time}
                        </p>
                    </div>
                    </li>
                ))}
                </ul>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
