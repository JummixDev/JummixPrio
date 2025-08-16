
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserProfileCard() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push('/settings');
  }
  
  const profileLink = `/profile/${user?.email?.split('@')[0] || 'me'}`;

  return (
    <Card>
        <CardHeader className="flex flex-col items-center text-center pb-4">
            <Link href={profileLink}>
                <Avatar className="w-24 h-24 mb-4 border-4 border-background ring-2 ring-primary">
                <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} data-ai-hint="person portrait" />
                <AvatarFallback>{user?.displayName?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'AD'}</AvatarFallback>
                </Avatar>
            </Link>
            <CardTitle className="font-headline">{user?.displayName || user?.email || 'Alex Doe'}</CardTitle>
            <Link href={profileLink}>
                <p className="text-muted-foreground hover:underline">@{user?.email?.split('@')[0] || 'alex_doe'}</p>
            </Link>
        </CardHeader>
      <CardContent className="text-center">
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
            <span className="font-bold text-lg text-foreground">28</span>
            <span>Events</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary">
            <span className="font-bold text-lg text-foreground">152</span>
            <span>Friends</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground px-2 mb-6">
          Lover of live music, outdoor adventures, and spontaneous weekend trips.
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

    