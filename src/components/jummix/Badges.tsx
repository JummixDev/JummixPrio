
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, ShieldCheck, Star, Trophy, Zap, ArrowUpRight, Diamond } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { allBadges } from "@/app/achievements/page";


const earnedBadges = allBadges.filter(b => b.earned);
const unearnedBadges = allBadges.filter(b => !b.earned);

export function Badges() {
  const displayedBadges = earnedBadges.slice(0, 6);
  return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">My Badges</CardTitle>
                    <CardDescription className="text-xs">Your collected achievements.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0" asChild>
                    <Link href="/achievements">
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4">
                    {displayedBadges.map((badge, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
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
  );
}


export function BadgesExpanded() {
  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">All Your Badges</CardTitle>
            <CardDescription>{earnedBadges.length} / {allBadges.length} Badges earned</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-4">Earned Badges</h3>
                        <TooltipProvider>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
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
                    </div>
                     <div>
                        <h3 className="font-semibold mb-4">Next Challenges</h3>
                         <TooltipProvider>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
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
                    </div>
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
  )
}
