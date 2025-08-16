
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Clock, Mail, MessageSquare, Plus, UserPlus, Users, Check, Loader2 } from 'lucide-react';
import { Footer } from '@/components/jummix/Footer';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/jummix/EventCard';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const mockAttendedEvents = [
    {
        id: "summer-music-fest",
        name: "Summer Music Fest",
        date: "2024-08-15",
        location: "Lakeside Park",
        image: "https://placehold.co/400x200.png",
        hint: "concert crowd",
        friendsAttending: [],
    },
    {
        id: "tech-innovators-summit",
        name: "Tech Innovators Summit",
        date: "2024-09-05",
        location: "Convention Center",
        image: "https://placehold.co/400x200.png",
        hint: "conference speaker",
        friendsAttending: [],
    }
]

const mockGallery = [
    { src: "https://placehold.co/600x400.png", hint: "user photo" },
    { src: "https://placehold.co/600x400.png", hint: "user selfie" },
    { src: "https://placehold.co/600x400.png", hint: "travel picture" },
    { src: "https://placehold.co/600x400.png", hint: "event photo" },
]

function QuickChatDialog({ userName, onSend }: { userName: string, onSend: () => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><MessageSquare className="mr-2"/>Message</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Message {userName}</DialogTitle>
                    <DialogDescription>Your message will be sent directly to {userName}.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Textarea placeholder={`Type your message to ${userName}...`} rows={5} />
                    <DialogClose asChild>
                        <Button onClick={onSend} className="w-full">Send Message</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function InteractionButtons({ isMe, initialIsFriend, initialIsRequestSent }: { isMe: boolean, initialIsFriend: boolean, initialIsRequestSent: boolean }) {
    const { toast } = useToast();
    const [isFriend, setIsFriend] = useState(initialIsFriend);
    const [isRequestSent, setIsRequestSent] = useState(initialIsRequestSent);

    const handleAddFriend = () => {
        setIsRequestSent(true);
        toast({title: "Friend request sent!"});
    }
    
    if (isMe) {
        return <Button variant="outline" disabled>This is you</Button>;
    }
    if (isFriend) {
        return <Button variant="secondary"><Check className="mr-2"/> Friends</Button>;
    }
    if (isRequestSent) {
        return <Button variant="secondary" disabled><Clock className="mr-2"/> Request Sent</Button>;
    }
    return <Button onClick={handleAddFriend}><UserPlus className="mr-2"/> Add Friend</Button>;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const username = typeof params.username === 'string' ? params.username : '';

  useEffect(() => {
    async function fetchUserProfile() {
        if (!username) return;

        setLoading(true);
        try {
            // Determine the username to query
            const isMe = username === 'me' || (loggedInUser && username === loggedInUser.email?.split('@')[0]);
            let userToFetch = username;
            if(isMe && loggedInUser) {
                userToFetch = loggedInUser.email!.split('@')[0];
            }
            
            // Query for the user
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", `${userToFetch}@example.com`), limit(1)); // Note: this is a simulated query on email
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                setProfileUser({
                    ...userData,
                    id: userDoc.id,
                    username: userData.email.split('@')[0],
                    // Mock data for now
                    banner: 'https://placehold.co/1000x300.png',
                    bannerHint: 'abstract tech pattern',
                    followers: userData.followers || 1250,
                    friends: userData.friends || 212,
                });
            } else {
                 setProfileUser(null);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setProfileUser(null);
        } finally {
            setLoading(false);
        }
    }

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [username, loggedInUser, authLoading]);

  if (loading || authLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );
  }

  if (!profileUser) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find a profile for "{username}".</p>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    )
  }
  
  const myUsername = loggedInUser?.email?.split('@')[0];
  const isMe = username === myUsername || username === 'me';

  const handleMessage = () => {
    toast({
      title: 'Message Sent!',
      description: `Your message to ${profileUser.displayName} has been sent.`,
    });
  };

  return (
    <div className="bg-secondary/20 min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft />
                </Link>
              </Button>
              <div className="ml-4">
                  <h1 className="text-xl font-bold">{profileUser.displayName}</h1>
                  <p className="text-sm text-muted-foreground">@{profileUser.username}</p>
              </div>
          </div>
      </header>
      <main className="flex-grow">
        <div className="container max-w-5xl mx-auto">
            {/* Banner */}
            <div className="h-48 md:h-64 relative rounded-b-lg overflow-hidden">
                <Image src={profileUser.banner} alt={`${profileUser.displayName}'s banner`} layout='fill' objectFit='cover' data-ai-hint={profileUser.bannerHint}/>
            </div>

            {/* Profile Header */}
             <div className="relative px-4 sm:px-8 z-20">
                 <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-24 sm:-mt-20">
                     <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background ring-4 ring-primary flex-shrink-0 -mt-12 sm:-mt-0">
                        <AvatarImage src={profileUser.photoURL || 'https://placehold.co/128x128.png'} alt={profileUser.displayName} data-ai-hint="person portrait" />
                        <AvatarFallback>{profileUser.displayName.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow w-full text-center sm:text-left pt-4 sm:pt-0">
                        <h2 className="text-3xl font-bold font-headline">{profileUser.displayName}</h2>
                        <p className="text-muted-foreground">@{profileUser.username}</p>
                        <div className="flex justify-center sm:justify-start gap-4 mt-2 text-sm">
                            <Link href="/friends" className="hover:underline"><span className="font-semibold">{profileUser.friends}</span> Friends</Link>
                            <span className="font-semibold">{profileUser.followers}</span> Followers
                        </div>
                    </div>
                     <div className="flex gap-2 flex-shrink-0">
                        <InteractionButtons isMe={isMe} initialIsFriend={false} initialIsRequestSent={profileUser.username === 'carlosray' ? true : false} />
                        {!isMe && <QuickChatDialog userName={profileUser.displayName} onSend={handleMessage} />}
                    </div>
                 </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold font-headline mb-4">About Me</h3>
                                <p className="text-sm text-muted-foreground">{profileUser.bio || "This user hasn't written a bio yet."}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold font-headline mb-4">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(profileUser.interests && profileUser.interests.length > 0) ? profileUser.interests.map((interest: string) => (
                                        <div key={interest} className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">{interest}</div>
                                    )) : <p className="text-sm text-muted-foreground">No interests listed.</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Right Content */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue="attended" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="hosted">Hosted</TabsTrigger>
                                <TabsTrigger value="attended">Attended</TabsTrigger>
                                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            </TabsList>
                            <TabsContent value="hosted" className="py-6">
                                <div className="text-center text-muted-foreground py-8">
                                    <p>{profileUser.displayName} hasn't hosted any events yet.</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="attended" className="py-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {mockAttendedEvents.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="gallery" className="py-6">
                                {mockGallery.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {mockGallery.map((photo, index) => (
                                            <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                                                <Image src={photo.src} alt={`Gallery photo ${index + 1}`} layout='fill' objectFit='cover' data-ai-hint={photo.hint} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>{profileUser.displayName} hasn't added any photos yet.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

