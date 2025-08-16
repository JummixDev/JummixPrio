
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const users = [
  { name: "Carlos Ray", username: "carlosray", avatar: "https://placehold.co/40x40.png", hint: "man portrait", points: 2450, rank: 1 },
  { name: "Jenna Smith", username: "jennasmith", avatar: "https://placehold.co/40x40.png", hint: "woman portrait", points: 2310, rank: 2 },
  { name: "Alex Doe", username: "alexdoe", avatar: "https://placehold.co/40x40.png", hint: "person portrait", points: 2100, rank: 3 },
  { name: "Aisha Khan", username: "aishakhan", avatar: "https://placehold.co/40x40.png", hint: "woman face", points: 1980, rank: 4 },
  { name: "David Lee", username: "davidlee", avatar: "https://placehold.co/40x40.png", hint: "man face", points: 1850, rank: 5 },
];

const rankColors: { [key: number]: string } = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-orange-600",
};

export function Leaderboard() {
  const router = useRouter();

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Trophy className="text-primary" /> Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.rank} className="flex items-center space-x-4 cursor-pointer hover:bg-muted/50 p-2 rounded-md" onClick={() => handleUserClick(user.username)}>
              <span className={`font-bold text-lg w-6 text-center ${rankColors[user.rank] || 'text-muted-foreground'}`}>{user.rank}</span>
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-semibold text-foreground truncate">{user.name}</p>
              </div>
              <span className="font-bold text-primary">{user.points} pts</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
