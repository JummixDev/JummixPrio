
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const users = [
  { name: "Carlos Ray", username: "carlosray", avatar: "https://placehold.co/40x40.png", hint: "man portrait", points: 2450, rank: 1 },
  { name: "Jenna Smith", username: "jennasmith", avatar: "https://placehold.co/40x40.png", hint: "woman portrait", points: 2310, rank: 2 },
  { name: "Alex Doe", username: "alexdoe", avatar: "https://placehold.co/40x40.png", hint: "person portrait", points: 2100, rank: 3 },
  { name: "Aisha Khan", username: "aishakhan", avatar: "https://placehold.co/40x40.png", hint: "woman face", points: 1980, rank: 4 },
  { name: "David Lee", username: "davidlee", avatar: "https://placehold.co/40x40.png", hint: "man face", points: 1850, rank: 5 },
];

const rankColors: { [key: number]: string } = {
  1: "text-yellow-500 border-yellow-500/50",
  2: "text-gray-400 border-gray-400/50",
  3: "text-orange-600 border-orange-600/50",
};

export function Leaderboard() {

  return (
        <Card className="transition-transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2">
                <Trophy className="text-primary" /> Leaderboard
            </CardTitle>
            <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
                <Link href="/leaderboard">
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
            {users.map((user) => (
                <li key={user.rank}>
                <Link href={`/profile/${user.username}`} className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-md">
                    <span className={`font-bold text-lg w-6 text-center ${rankColors[user.rank] || 'text-muted-foreground'}`}>{user.rank}</span>
                    <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                    <p className="font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                    <span className="font-bold text-primary">{user.points} pts</span>
                </Link>
                </li>
            ))}
            </ul>
        </CardContent>
        </Card>
  );
}
