

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpRight, Bell, CalendarCheck, MessageSquare, UserPlus } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

const notifications = [
  {
    user: "Jenna Smith",
    avatar: "https://placehold.co/40x40.png",
    hint: "woman portrait",
    action: "sent you a message",
    time: "2m ago",
    icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
    link: "/chats"
  },
  {
    user: "Summer Music Fest",
    avatar: "https://placehold.co/40x40.png",
    hint: "concert crowd",
    action: "has been updated",
    time: "1h ago",
    icon: <CalendarCheck className="w-4 h-4 text-green-500" />,
    link: "/event/summer-music-fest"
  },
  {
    user: "Alex Doe",
    avatar: "https://placehold.co/40x40.png",
    hint: "person portrait",
    action: "mentioned you in a comment",
    time: "3h ago",
    icon: <UserPlus className="w-4 h-4 text-primary" />,
    link: "#"
  },
];

const allNotifications = [
    ...notifications,
    {
        user: "David Lee",
        avatar: "https://placehold.co/40x40.png",
        hint: "man face",
        action: "accepted your friend request",
        time: "5h ago",
        icon: <UserPlus className="w-4 h-4 text-primary" />,
        link: "/profile/davidlee"
    },
    {
        user: "Your Ticket for Summer Music Fest",
        avatar: "https://placehold.co/40x40.png",
        hint: "ticket icon",
        action: "is confirmed. View in 'My Tickets'.",
        time: "1d ago",
        icon: <CalendarCheck className="w-4 h-4 text-green-500" />,
        link: "/my-tickets"
    },
    {
        user: "Carlos Ray",
        avatar: "https://placehold.co/40x40.png",
        hint: "man portrait",
        action: "sent you a message",
        time: "2d ago",
        icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
        link: "/chats"
    },
]

export function NotificationCenter() {
  return (
    <Dialog>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
                <Bell className="text-primary"/>
                <div>
                    <CardTitle className="font-headline">Notifications</CardTitle>
                    <CardDescription>Recent updates and mentions.</CardDescription>
                </div>
            </div>
             <DialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
            {notifications.map((notification, index) => (
                <li key={index}>
                <Link href={notification.link} className="flex items-start space-x-4 p-2 -m-2 rounded-lg hover:bg-muted/50">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        {notification.icon}
                    </div>
                    <div className="flex-grow">
                    <p className="text-sm">
                        <span className="font-bold text-foreground">{notification.user}</span>{" "}
                        {notification.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                    </p>
                    </div>
                </Link>
                </li>
            ))}
            </ul>
        </CardContent>
        </Card>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-headline flex items-center gap-2"><Bell/> All Notifications</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
                <ul className="space-y-4 pr-4">
                {allNotifications.map((notification, index) => (
                    <li key={index}>
                    <Link href={notification.link} className="flex items-start space-x-4 p-2 -m-2 rounded-lg hover:bg-muted/50">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                            {notification.icon}
                        </div>
                        <div className="flex-grow">
                        <p className="text-sm">
                            <span className="font-bold text-foreground">{notification.user}</span>{" "}
                            {notification.action}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                        </p>
                        </div>
                    </Link>
                    </li>
                ))}
                </ul>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
