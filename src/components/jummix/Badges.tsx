
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck, Star, Trophy, Zap, ArrowUpRight, Diamond } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const badges = [
  { icon: <Trophy className="w-8 h-8 text-yellow-500" />, name: "Top Contributor", description: "For outstanding community contributions." },
  { icon: <Award className="w-8 h-8 text-blue-500" />, name: "First Event", description: "For creating your first event." },
  { icon: <Star className="w-8 h-8 text-amber-400" />, name: "Super Fan", description: "For attending 10+ events." },
  { icon: <Zap className="w-8 h-8 text-purple-500" />, name: "Power User", description: "For regular and active use." },
  { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, name: "Verified Host", description: "You are a verified host." },
  { icon: <Star className="w-8 h-8 text-red-500" />, name: "Early Bird", description: "One of the first 1000 users." },
];

const allBadges = [
    ...badges,
    { icon: <Diamond className="w-8 h-8 text-cyan-400" />, name: "Community Leader", description: "For hosting 5+ events." },
    { icon: <Trophy className="w-8 h-8 text-slate-400" />, name: "Top 10 Host", description: "Reach the top 10 in the host ranking." },
    { icon: <Award className="w-8 h-8 text-orange-500" />, name: "First Review", description: "For writing your first review." },
    { icon: <Star className="w-8 h-8 text-pink-400" />, name: "Social Butterfly", description: "Connect with 50+ friends." },
    { icon: <Zap className="w-8 h-8 text-teal-500" />, name: "Streak Starter", description: "Active daily for a week." },
    { icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />, name: "Trusted Member", description: "For positive community reviews." },
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
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="font-headline">All My Badges</DialogTitle>
                <DialogDescription>Collect them all! Here is an overview of your achievements so far and what you can still achieve.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                    {allBadges.map((badge, index) => (
                        <Card key={index} className="p-4 flex items-center gap-4">
                            <div className="flex items-center justify-center bg-secondary p-3 rounded-lg">
                                {badge.icon}
                            </div>
                            <div>
                                <p className="font-semibold">{badge.name}</p>
                                <p className="text-xs text-muted-foreground">{badge.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
