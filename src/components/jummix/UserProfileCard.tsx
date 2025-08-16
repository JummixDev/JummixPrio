
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function UserProfileCard() {
  const { user, signOut, loading: authLoading, userData } = useAuth();
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push('/settings');
  }

  if (authLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null; // Or some other placeholder for a non-logged-in state
  }
  
  const profileLink = `/profile/me`;
  const displayName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const username = user?.email?.split('@')[0] || 'username';
  const photoURL = userData?.photoURL || user?.photoURL;

  return (
    <Card>
        <CardHeader className="flex flex-col items-center text-center pb-4">
            <Link href={profileLink}>
                <Avatar className="w-24 h-24 mb-4 border-4 border-background ring-2 ring-primary">
                <AvatarImage src={photoURL || 'https://placehold.co/128x128.png'} alt={displayName} data-ai-hint="person portrait" />
                <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </Link>
            <CardTitle className="font-headline">{displayName}</CardTitle>
            <Link href={profileLink}>
                <p className="text-muted-foreground hover:underline">@{username}</p>
            </Link>
        </CardHeader>
      <CardContent className="text-center">
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
          <Link href="/my-events" className="flex flex-col items-center p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
            <span className="font-bold text-lg text-foreground">{userData?.eventsCount || 0}</span>
            <span>Events</span>
          </Link>
          <Link href="/friends" className="flex flex-col items-center p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
            <span className="font-bold text-lg text-foreground">{userData?.friendsCount || 0}</span>
            <span>Friends</span>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground px-2 mb-6">
          {userData?.bio || "No bio yet. Add one in settings!"}
        </p>
        <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" /> Account Settings
            </Button>
            <Button variant="ghost" className="w-full" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
        </div>

      </CardContent>
    </Card>
  );
}
