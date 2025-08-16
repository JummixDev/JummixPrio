
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Check, UserCheck, Search } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const followers = [
    { name: 'Jenna Smith', username: 'jennasmith', avatar: 'https://placehold.co/40x40.png', hint: 'woman portrait', isFollowing: true },
    { name: 'Carlos Ray', username: 'carlosray', avatar: 'https://placehold.co/40x40.png', hint: 'man portrait', isFollowing: false },
];

const following = [
    { name: 'Jenna Smith', username: 'jennasmith', avatar: 'https://placehold.co/40x40.png', hint: 'woman portrait' },
    { name: 'Aisha Khan', username: 'aishakhan', avatar: 'https://placehold.co/40x40.png', hint: 'woman face' },
];

const suggestions = [
    { name: 'David Lee', username: 'davidlee', avatar: 'https://placehold.co/40x40.png', hint: 'man face' },
    { name: 'Maria Garcia', username: 'mariagarcia', avatar: 'https://placehold.co/40x40.png', hint: 'woman smiling' },
];

const FriendList = ({ users, type }: { users: any[], type: 'follower' | 'following' | 'suggestion' }) => {
    const [userList, setUserList] = useState(users);

    const handleFollow = (username: string) => {
        setUserList(userList.map(u => u.username === username ? {...u, isFollowing: true} : u));
    }
    const handleUnfollow = (username: string) => {
        setUserList(userList.filter(u => u.username !== username));
    }


    return (
        <div className="space-y-4">
            {userList.map(user => (
                <div key={user.username} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                    {type === 'follower' && (
                        user.isFollowing ? (
                            <Button variant="secondary" disabled><UserCheck /> Following</Button>
                        ) : (
                            <Button onClick={() => handleFollow(user.username)}><UserPlus /> Follow Back</Button>
                        )
                    )}
                    {type === 'following' && <Button variant="outline" onClick={() => handleUnfollow(user.username)}>Unfollow</Button>}
                    {type === 'suggestion' && <Button onClick={() => handleFollow(user.username)}><UserPlus /> Follow</Button>}
                </div>
            ))}
        </div>
    );
};


export default function FriendsPage() {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-4">Friends</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <Card>
            <CardContent className="p-4">
                <Tabs defaultValue="followers">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <TabsList className="grid w-full sm:w-auto sm:grid-cols-3">
                            <TabsTrigger value="followers">Followers</TabsTrigger>
                            <TabsTrigger value="following">Following</TabsTrigger>
                            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                        </TabsList>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search friends..." className="pl-10" />
                        </div>
                    </div>
                    <TabsContent value="followers">
                        <FriendList users={followers} type="follower" />
                    </TabsContent>
                    <TabsContent value="following">
                        <FriendList users={following} type="following" />
                    </TabsContent>
                    <TabsContent value="suggestions">
                        <FriendList users={suggestions} type="suggestion" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
