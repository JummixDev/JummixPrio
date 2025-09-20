
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/jummix/Footer";
import { Leaderboard } from "@/components/jummix/Leaderboard";

const fullLeaderboard = [
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


const rankColors: { [key: number]: string } = {
  1: "text-yellow-500 border-yellow-500/50",
  2: "text-gray-400 border-gray-400/50",
  3: "text-orange-600 border-orange-600/50",
};

export default function LeaderboardPage() {

  return (
     <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Leaderboard</h1>
          </div>
      </header>
       <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-16 flex-grow">
            <Leaderboard />
      </main>
      <Footer/>
    </div>
  );
}
