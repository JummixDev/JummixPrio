
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const mockUsers = [
  { name: "Carlos Ray", username: "carlosray", avatar: "https://placehold.co/100x100.png", hint: "man portrait" },
  { name: "Alex Doe", username: "alexdoe", avatar: "https://placehold.co/100x100.png", hint: "person portrait" },
  { name: "Aisha Khan", username: "aishakhan", avatar: "https://placehold.co/100x100.png", hint: "woman face" },
  { name: "Jenna Smith", username: "jennasmith", avatar: "https://placehold.co/100x100.png", hint: "woman portrait" },
  { name: "David Lee", username: "davidlee", avatar: "https://placehold.co/100x100.png", hint: "man face" },
];

const allMockUsers = [
    ...mockUsers,
    { name: "Maria Garcia", username: "mariagarcia", avatar: "https://placehold.co/100x100.png", hint: "woman smiling" },
    { name: "Kenji Tanaka", username: "kenjitanaka", avatar: "https://placehold.co/100x100.png", hint: "man with glasses" },
    { name: "Sofia Rossi", username: "sofiarossi", avatar: "https://placehold.co/100x100.png", hint: "woman looking away" },
    { name: "Ben Carter", username: "bencarter", avatar: "https://placehold.co/100x100.png", hint: "man with beard" },
];

export function PeopleNearby() {
  return (
    <Dialog>
        <Card className="transition-transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline flex items-center gap-2"><Users /> People Nearby</CardTitle>
                <CardDescription>Discover new people in your area.</CardDescription>
            </div>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {mockUsers.map((user) => (
                <Link
                key={user.username}
                href={`/profile/${user.username}`}
                className="flex flex-col items-center gap-2 text-center flex-shrink-0 cursor-pointer group"
                >
                <Avatar className="w-16 h-16 border-2 border-transparent group-hover:border-primary transition-colors">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium w-16 truncate">{user.name}</span>
                </Link>
            ))}
            </div>
        </CardContent>
        </Card>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-headline flex items-center gap-2"><Users/> All People Nearby</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
                <div className="grid grid-cols-4 gap-4 p-4">
                    {allMockUsers.map((user) => (
                        <Link
                        key={user.username}
                        href={`/profile/${user.username}`}
                        className="flex flex-col items-center gap-2 text-center flex-shrink-0 cursor-pointer group"
                        >
                        <Avatar className="w-20 h-20 border-2 border-transparent group-hover:border-primary transition-colors">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium w-24 truncate">{user.name}</span>
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
