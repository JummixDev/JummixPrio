
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const users = [
  { name: "Carlos Ray", username: "carlosray", avatar: "https://placehold.co/40x40.png", hint: "man portrait", points: 2450, rank: 1 },
  { name: "Jenna Smith", username: "jennasmith", avatar: "https://placehold.co/40x40.png", hint: "woman portrait", points: 2310, rank: 2 },
  { name: "Alex Doe", username: "alexdoe", avatar: "https://placehold.co/40x40.png", hint: "person portrait", points: 2100, rank: 3 },
  { name: "Aisha Khan", username: "aishakhan", avatar: "https://placehold.co/40x40.png", hint: "woman face", points: 1980, rank: 4 },
  { name: "David Lee", username: "davidlee", avatar: "https://placehold.co/40x40.png", hint: "man face", points: 1850, rank: 5 },
];

const fullLeaderboard = [
  ...users,
  { name: "Maria Garcia", username: "mariagarcia", avatar: "https://placehold.co/40x40.png", hint: "woman smiling", points: 1750, rank: 6 },
  { name: "Kenji Tanaka", username: "kenjitanaka", avatar: "https://placehold.co/40x40.png", hint: "man with glasses", points: 1680, rank: 7 },
  { name: "Sofia Rossi", username: "sofiarossi", avatar: "https://placehold.co/40x40.png", hint: "woman looking away", points: 1590, rank: 8 },
  { name: "Ben Carter", username: "bencarter", avatar: "https://placehold.co/40x40.png", hint: "man with beard", points: 1420, rank: 9 },
  { name: "Chloe Dubois", username: "chloedubois", avatar: "https://placehold.co/40x40.png", hint: "person with hat", points: 1350, rank: 10 },
  { name: "Liam O'Connell", username: "liamoconnell", avatar: "https://placehold.co/40x40.png", hint: "man red hair", points: 1200, rank: 11 },
  { name: "Fatima Al-Fassi", username: "fatimaalfassi", avatar: "https://placehold.co/40x40.png", hint: "woman headscarf", points: 1150, rank: 12 },
];


const rankColors: { [key: number]: string } = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-orange-600",
};

export function Leaderboard() {

  return (
    <Dialog>
        <Card className="transition-transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline flex items-center gap-2">
                <Trophy className="text-primary" /> Leaderboard
            </CardTitle>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
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
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="font-headline flex items-center gap-2"><Trophy className="text-primary"/> Full Leaderboard</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
                <ul className="space-y-4 pr-4">
                {fullLeaderboard.map((user) => (
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
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
