
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ShieldCheck, Star, Trophy, Zap, ArrowUpRight, Diamond } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const badges = [
  { icon: <Trophy className="w-8 h-8 text-yellow-500" />, name: "Top Contributor", description: "Für herausragende Community-Beiträge." },
  { icon: <Award className="w-8 h-8 text-blue-500" />, name: "First Event", description: "Für die Erstellung deines ersten Events." },
  { icon: <Star className="w-8 h-8 text-amber-400" />, name: "Super Fan", description: "Für die Teilnahme an 10+ Events." },
  { icon: <Zap className="w-8 h-8 text-purple-500" />, name: "Power User", description: "Für regelmäßige und aktive Nutzung." },
  { icon: <ShieldCheck className="w-8 h-8 text-green-500" />, name: "Verified Host", description: "Du bist ein verifizierter Host." },
  { icon: <Star className="w-8 h-8 text-red-500" />, name: "Early Bird", description: "Einer der ersten 1000 Nutzer." },
];

const allBadges = [
    ...badges,
    { icon: <Diamond className="w-8 h-8 text-cyan-400" />, name: "Community Leader", description: "Für das Hosten von 5+ Events." },
    { icon: <Trophy className="w-8 h-8 text-slate-400" />, name: "Top 10 Host", description: "Erreiche die Top 10 im Host-Ranking." },
    { icon: <Award className="w-8 h-8 text-orange-500" />, name: "First Review", description: "Für das Schreiben deiner ersten Bewertung." },
    { icon: <Star className="w-8 h-8 text-pink-400" />, name: "Social Butterfly", description: "Vernetze dich mit 50+ Freunden." },
    { icon: <Zap className="w-8 h-8 text-teal-500" />, name: "Streak Starter", description: "Täglich aktiv für eine Woche." },
    { icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />, name: "Trusted Member", description: "Für positive Community-Bewertungen." },
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
                <DialogDescription>Sammle sie alle! Hier ist eine Übersicht über deine bisherigen Erfolge und was du noch erreichen kannst.</DialogDescription>
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
