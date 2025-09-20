
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { fullLeaderboard, rankColors } from "@/app/achievements/page";
import { cn } from "@/lib/utils";

const topUsers = fullLeaderboard.slice(0, 4);

export function Leaderboard({ onZoom }: { onZoom: () => void }) {
  return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Trophy className="text-primary" /> Leaderboard
                    </CardTitle>
                    <CardDescription className="text-xs">Top community members.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0" onClick={onZoom}>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Button>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                {topUsers.map((user) => (
                    <li key={user.rank}>
                    <Link href={`/profile/${user.username}`} className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded-md">
                        <span className={`font-bold text-lg w-6 text-center ${rankColors[user.rank] || 'text-muted-foreground'}`}>{user.rank}</span>
                        <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                        <p className="font-semibold text-foreground truncate">{user.name}</p>
                        </div>
                        <span className="font-bold text-sm text-primary">{user.points} pts</span>
                    </Link>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
  );
}

export function LeaderboardExpanded() {
  return (
     <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Trophy className="text-primary"/> Community Leaderboard</CardTitle>
            <CardDescription>See who's making the biggest impact in the Jummix community.</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[80vh]">
                <ul className="space-y-2 pr-4">
                {fullLeaderboard.map((user) => (
                    <li key={user.rank}>
                    <Link href={`/profile/${user.username}`} className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-3 rounded-lg border-b">
                        <span className={cn("font-bold text-xl w-8 text-center", rankColors[user.rank] || 'text-muted-foreground')}>{user.rank}</span>
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold text-foreground truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                        <span className="font-bold text-lg text-primary">{user.points.toLocaleString('en-US')} pts</span>
                    </Link>
                    </li>
                ))}
                </ul>
            </ScrollArea>
        </CardContent>
    </Card>
  )
}
