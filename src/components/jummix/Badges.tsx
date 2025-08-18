
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck, Star, Trophy, Zap, ArrowUpRight, Diamond } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const badges = [
  { icon: <Trophy className="w-8 h-8 text-yellow-500" />, name: "Top Contributor" },
  { icon: <Award className="w-8 h-8 text-blue-500" />, name: "First Event" },
  { icon: <Star className="w-8 h-8 text-amber-400" />, name: "Super Fan" },
  { icon: <Zap className="w-8 h-8 text-purple-500" />, name: "Power User" },
  { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, name: "Verified Host" },
  { icon: <Star className="w-8 h-8 text-red-500" />, name: "Early Bird" },
];

const allBadges = [
    ...badges,
    { icon: <Diamond className="w-8 h-8 text-cyan-400" />, name: "Community Leader" },
    { icon: <Trophy className="w-8 h-8 text-slate-400" />, name: "Top 10 Host" },
    { icon: <Award className="w-8 h-8 text-orange-500" />, name: "First Review" },
    { icon: <Star className="w-8 h-8 text-pink-400" />, name: "Social Butterfly" },
    { icon: <Zap className="w-8 h-8 text-teal-500" />, name: "Streak Starter" },
    { icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />, name: "Trusted Member" },
]

export function Badges() {
  return (
    <Dialog>
        <Card className="transition-transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">My Badges</CardTitle>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
        </CardHeader>
        <CardContent>
            <TooltipProvider>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-4">
                {badges.map((badge, index) => (
                <Tooltip key={index}>
                    <TooltipTrigger asChild>
                    <div className="flex items-center justify-center bg-secondary p-4 rounded-lg aspect-square cursor-pointer transition-transform hover:scale-110">
                        {badge.icon}
                    </div>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>{badge.name}</p>
                    </TooltipContent>
                </Tooltip>
                ))}
            </div>
            </TooltipProvider>
        </CardContent>
        </Card>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="font-headline">All My Badges</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
                <TooltipProvider>
                <div className="grid grid-cols-4 gap-4 p-4">
                    {allBadges.map((badge, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                        <div className="flex flex-col items-center justify-center gap-2 bg-secondary p-4 rounded-lg aspect-square cursor-pointer transition-transform hover:scale-110">
                            {badge.icon}
                            <p className="text-xs text-center text-muted-foreground">{badge.name}</p>
                        </div>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>{badge.name}</p>
                        </TooltipContent>
                    </Tooltip>
                    ))}
                </div>
                </TooltipProvider>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
