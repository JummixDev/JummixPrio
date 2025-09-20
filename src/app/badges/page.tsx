
'use client';

import { Award, ShieldCheck, Star, Trophy, Zap, Diamond, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/jummix/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badges } from "@/components/jummix/Badges";

const allBadges = [
    { icon: <Trophy className="w-10 h-10 text-yellow-500" />, name: "Top Contributor", description: "For outstanding community contributions.", earned: true },
    { icon: <Award className="w-10 h-10 text-blue-500" />, name: "First Event", description: "For creating your first event.", earned: true },
    { icon: <Star className="w-10 h-10 text-amber-400" />, name: "Super Fan", description: "For attending 10+ events.", earned: true },
    { icon: <Zap className="w-10 h-10 text-purple-500" />, name: "Power User", description: "For regular and active use.", earned: true },
    { icon: <ShieldCheck className="w-10 h-10 text-green-500" />, name: "Verified Host", description: "You are a verified host.", earned: true },
    { icon: <Star className="w-10 h-10 text-red-500" />, name: "Early Bird", description: "One of the first 1000 users.", earned: true },
    { icon: <Diamond className="w-10 h-10 text-cyan-400" />, name: "Community Leader", description: "For hosting 5+ events.", earned: false },
    { icon: <Trophy className="w-10 h-10 text-slate-400" />, name: "Top 10 Host", description: "Reach the top 10 in the host ranking.", earned: false },
    { icon: <Award className="w-10 h-10 text-orange-500" />, name: "First Review", description: "For writing your first review.", earned: true },
    { icon: <Star className="w-10 h-10 text-pink-400" />, name: "Social Butterfly", description: "Connect with 50+ friends.", earned: false },
    { icon: <Zap className="w-10 h-10 text-teal-500" />, name: "Streak Starter", description: "Active daily for a week.", earned: false },
    { icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />, name: "Trusted Member", description: "For positive community reviews.", earned: false },
];


export default function BadgesPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">My Badges</h1>
          </div>
      </header>
       <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-16 flex-grow">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-headline mb-2">Your Achievements</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Collect them all! Here is an overview of your achievements so far and what you can still achieve.</p>
            </div>
            <Badges />
      </main>
      <Footer />
    </div>
  );
}
