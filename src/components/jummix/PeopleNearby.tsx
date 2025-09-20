
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { ArrowUpRight, Compass, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const mockUsers = [
  { name: "Carlos Ray", username: "carlosray", avatar: "https://placehold.co/100x100.png", hint: "man portrait" },
  { name: "Alex Doe", username: "alexdoe", avatar: "https://placehold.co/100x100.png", hint: "person portrait" },
  { name: "Aisha Khan", username: "aishakhan", avatar: "https://placehold.co/100x100.png", hint: "woman face" },
  { name: "Jenna Smith", username: "jennasmith", avatar: "https://placehold.co/100x100.png", hint: "woman portrait" },
];

const allMockUsers = [
    ...mockUsers,
    { name: "David Lee", username: "davidlee", avatar: "https://placehold.co/100x100.png", hint: "man face" },
    { name: "Maria Garcia", username: "mariagarcia", avatar: "https://placehold.co/100x100.png", hint: "woman smiling" },
    { name: "Kenji Tanaka", username: "kenjitanaka", avatar: "https://placehold.co/100x100.png", hint: "man with glasses" },
    { name: "Sofia Rossi", username: "sofiarossi", avatar: "https://placehold.co/100x100.png", hint: "woman looking away" },
    { name: "Ben Carter", username: "bencarter", avatar: "https://placehold.co/100x100.png", hint: "man with beard" },
];

export function PeopleNearby({ onZoom }: { onZoom: () => void }) {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2"><Users /> People Nearby</CardTitle>
            <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0" onClick={onZoom}>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </Button>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-4 gap-4">
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
  );
}


export function PeopleNearbyExpanded() {
  return (
    <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Users /> All People Nearby</CardTitle>
            <CardDescription>Discover all people in your vicinity.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/friends">
              <Compass className="mr-2"/> Discover More
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="flex-grow p-0">
            <ScrollArea className="h-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
                    {allMockUsers.map((user) => (
                        <Link
                            key={user.username}
                            href={`/profile/${user.username}`}
                            className="flex flex-col items-center gap-2 text-center cursor-pointer group"
                            >
                            <Avatar className="w-20 h-20 border-2 border-transparent group-hover:border-primary transition-colors">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold truncate">{user.name}</span>
                            <span className="text-sm text-muted-foreground">@{user.username}</span>
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
  )
}
