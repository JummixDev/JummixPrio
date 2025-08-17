
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Button } from "../ui/button";

const mockUsers = [
  { name: "Carlos Ray", username: "carlosray", avatar: "https://placehold.co/100x100.png", hint: "man portrait" },
  { name: "Alex Doe", username: "alexdoe", avatar: "https://placehold.co/100x100.png", hint: "person portrait" },
  { name: "Aisha Khan", username: "aishakhan", avatar: "https://placehold.co/100x100.png", hint: "woman face" },
  { name: "Jenna Smith", username: "jennasmith", avatar: "https://placehold.co/100x100.png", hint: "woman portrait" },
  { name: "David Lee", username: "davidlee", avatar: "https://placehold.co/100x100.png", hint: "man face" },
];

export function PeopleNearby() {
  return (
    <Card className="transition-transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline flex items-center gap-2"><Users /> People Nearby</CardTitle>
            <CardDescription>Discover new people in your area.</CardDescription>
        </div>
         <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
            <Link href="/friends">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </Link>
        </Button>
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
  );
}
