
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Trophy, Award, Star, Zap, ShieldCheck, Diamond } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/jummix/Footer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export const fullLeaderboard = [
  { name: "Carlos Ray", username: "carlosray", avatar: "https://placehold.co/40x40.png", hint: "man portrait", points: 2450, rank: 1 },
  { name: "Jenna Smith", username: "jennasmith", avatar: "https://placehold.co/40x40.png", hint: "woman portrait", points: 2310, rank: 2 },
  { name: "Alex Doe", username: "alexdoe", avatar: "https://placehold.co/40x40.png", hint: "person portrait", points: 2100, rank: 3 },
  { name: "Aisha Khan", username: "aishakhan", avatar: "https://placehold.co/40x40.png", hint: "woman face", points: 1980, rank: 4 },
  { name: "David Lee", username: "davidlee", avatar: "https://placehold.co/40x40.png", hint: "man face", points: 1850, rank: 5 },
  { name: "Maria Garcia", username: "mariagarcia", avatar: "https://placehold.co/40x40.png", hint: "woman smiling", points: 1750, rank: 6 },
  { name: "Kenji Tanaka", username: "kenjitanaka", avatar: "https://placehold.co/40x40.png", hint: "man with glasses", points: 1680, rank: 7 },
  { name: "Sofia Rossi", username: "sofiarossi", avatar: "https://placehold.co/40x40.png", hint: "woman looking away", points: 1590, rank: 8 },
  { name: "Ben Carter", username: "bencarter", avatar: "https://placehold.co/40x40.png", hint: "man with beard", points: 1420, rank: 9 },
  { name: "Chloe Dubois", username: "chloedubois", avatar: "https://placehold.co/40x40.png", hint: "person with hat", points: 1350, rank: 10 },
  { name: "Liam O'Connell", username: "liamoconnell", avatar: "https://placehold.co/40x40.png", hint: "man red hair", points: 1200, rank: 11 },
  { name: "Fatima Al-Fassi", username: "fatimaalfassi", avatar: "https://placehold.co/40x40.png", hint: "woman headscarf", points: 1150, rank: 12 },
];


export const rankColors: { [key: number]: string } = {
  1: "text-yellow-500 border-yellow-500/50",
  2: "text-gray-400 border-gray-400/50",
  3: "text-orange-600 border-orange-600/50",
};

export const allBadges = [
    { icon: <Trophy className="w-10 h-10 text-yellow-500" />, name: "Top Contributor", description: "For outstanding community contributions.", earned: true },
    { icon: <Award className="w-10 h-10 text-blue-500" />, name: "First Event", description: "For creating your first event.", earned: true },
    { icon: <Star className="w-10 h-10 text-amber-400" />, name: "Super Fan", description: "For attending 10+ events.", earned: true },
    { icon: <Zap className="w-10 h-10 text-purple-500" />, name: "Power User", description: "For regular and active use.", earned: true },
    { icon: <ShieldCheck className="w-10 h-10 text-green-500" />, name: "Verified Host", description: "You are a verified host.", earned: true },
    { icon: <Star className="w-10 h-10 text-red-500" />, name: "Early Bird", description: "One of the first 1000 users.", earned: true },
    { icon: <Award className="w-10 h-10 text-orange-500" />, name: "First Review", description: "For writing your first review.", earned: true },
    { icon: <Diamond className="w-10 h-10 text-cyan-400" />, name: "Community Leader", description: "For hosting 5+ events.", earned: false },
    { icon: <Trophy className="w-10 h-10 text-slate-400" />, name: "Top 10 Host", description: "Reach the top 10 in the host ranking.", earned: false },
    { icon: <Star className="w-10 h-10 text-pink-400" />, name: "Social Butterfly", description: "Connect with 50+ friends.", earned: false },
    { icon: <Zap className="w-10 h-10 text-teal-500" />, name: "Streak Starter", description: "Active daily for a week.", earned: false },
    { icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />, name: "Trusted Member", description: "For positive community reviews.", earned: false },
];

export default function AchievementsPage() {

    const earnedBadges = allBadges.filter(b => b.earned);
    const unearnedBadges = allBadges.filter(b => !b.earned);

  return (
     <div className="bg-secondary/20 min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Achievements</h1>
          </div>
      </header>
       <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-16 flex-grow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Leaderboard Column */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Trophy className="text-primary"/> Community Leaderboard</CardTitle>
                            <CardDescription>See who's making the biggest impact in the Jummix community.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[70vh]">
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
                </div>
                {/* Badges Column */}
                <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-36">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Your Accomplishments</CardTitle>
                            <CardDescription>{earnedBadges.length} / {allBadges.length} Badges earned</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <TooltipProvider>
                                <div className="grid grid-cols-4 gap-4">
                                    {earnedBadges.map((badge, index) => (
                                        <Tooltip key={index}>
                                            <TooltipTrigger>
                                                <div className="flex items-center justify-center bg-secondary p-4 rounded-lg aspect-square cursor-pointer transition-transform hover:scale-110 border-2 border-primary/50 shadow-md">
                                                    {badge.icon}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="font-bold">{badge.name}</p>
                                                <p>{badge.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Next Challenges</CardTitle>
                            <CardDescription>Unlock these to level up your profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <TooltipProvider>
                                <div className="grid grid-cols-4 gap-4">
                                    {unearnedBadges.map((badge, index) => (
                                        <Tooltip key={index}>
                                            <TooltipTrigger>
                                                 <div className="flex items-center justify-center bg-secondary p-4 rounded-lg aspect-square cursor-pointer transition-transform hover:scale-110 opacity-50 hover:opacity-100">
                                                    {badge.icon}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="font-bold">{badge.name}</p>
                                                <p>{badge.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </div>
            </div>
      </main>
      <Footer/>
    </div>
  );
}
