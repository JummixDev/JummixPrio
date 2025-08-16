
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, CalendarCheck, Camera, Check, Clock, Mail, MessageSquare, Plus, UserPlus, Users } from 'lucide-react';
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
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';


const mockUsers: { [key: string]: any } = {
  carlosray: {
    name: 'Carlos Ray',
    username: 'carlosray',
    avatar: 'https://placehold.co/128x128.png',
    banner: 'https://placehold.co/1000x300.png',
    bannerHint: 'abstract tech pattern',
    hint: 'man portrait',
    bio: 'Tech enthusiast and serial entrepreneur. Always looking for the next big thing. Love to connect with like-minded people at tech summits and hackathons.',
    followers: 1250,
    friends: 212,
    interests: ['Technology', 'Startups', 'AI', 'Rock Music', 'Coffee'],
  },
  jennasmith: {
    name: 'Jenna Smith',
    username: 'jennasmith',
    avatar: 'https://placehold.co/128x128.png',
    banner: 'https://placehold.co/1000x300.png',
    bannerHint: 'artistic watercolor splash',
    hint: 'woman portrait',
    bio: 'Designer and artist. My passion is creating beautiful and intuitive user experiences. In my free time, you can find me at art galleries, music festivals, or hiking.',
    followers: 890,
    friends: 189,
    interests: ['Design', 'Art', 'Music Festivals', 'Hiking', 'Photography'],
  },
  alexdoe: {
    name: 'Alex Doe',
    username: 'alexdoe',
    avatar: 'https://placehold.co/128x128.png',
    banner: 'https://placehold.co/1000x300.png',
    bannerHint: 'moody forest landscape',
    hint: 'person portrait',
    bio: 'A mystery wrapped in an enigma. Shows up at the coolest events, knows everyone, but says little. What will they do next?',
    followers: 2300,
    friends: 500,
    interests: ['Spontaneity', 'Live Music', 'Art Installations', 'Good Vibes'],
  },
   aishakhan: {
    name: 'Aisha Khan',
    username: 'aishakhan',
    avatar: 'https://placehold.co/128x128.png',
    banner: 'https://placehold.co/1000x300.png',
    bannerHint: 'colorful spice market',
    hint: 'woman face',
    bio: 'Food blogger and culinary adventurer. I travel the world one bite at a time. My goal is to visit every Michelin-starred restaurant!',
    followers: 5600,
    friends: 320,
    interests: ['Food', 'Travel', 'Blogging', 'Wine Tasting', 'Cooking'],
  },
  davidlee: {
    name: 'David Lee',
    username: 'davidlee',
    avatar: 'https://placehold.co/128x128.png',
    banner: 'https://placehold.co/1000x300.png',
    bannerHint: 'close up guitar strings',
    hint: 'man face',
    bio: 'Software engineer by day, musician by night. I love playing guitar and attending open mic nights. Let\'s jam sometime!',
    followers: 450,
    friends: 150,
    interests: ['Music', 'Coding', 'Guitar', 'Video Games', 'Craft Beer'],
  },
   me: { // Mock data for the logged-in user
    name: 'Alex Doe',
    username: 'alexdoe',
    avatar: 'https://placehold.co/128x128.png',
    banner: 'https://placehold.co/1000x300.png',
    bannerHint: 'moody forest landscape',
    hint: 'person portrait',
    bio: 'A mystery wrapped in an enigma. Shows up at the coolest events, knows everyone, but says little. What will they do next?',
    followers: 2300,
    friends: 500,
    interests: ['Spontaneity', 'Live Music', 'Art Installations', 'Good Vibes'],
  },
};

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
                    <Button onClick={onSend} className="w-full">Send Message</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function InteractionButtons({ isFriend, isRequestSent, isMe }: { isFriend: boolean, isRequestSent: boolean, isMe: boolean }) {
    const { toast } = useToast();
    
    if (isMe) {
        return <Button variant="outline" disabled>This is you</Button>;
    }
    if (isFriend) {
        return <Button variant="secondary"><Check className="mr-2"/> Friends</Button>;
    }
    if (isRequestSent) {
        return <Button variant="secondary" disabled><Clock className="mr-2"/> Request Sent</Button>;
    }
    return <Button onClick={() => toast({title: "Friend request sent!"})}><UserPlus className="mr-2"/> Add Friend</Button>;
}


export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: loggedInUser } = useAuth();
  
  const username = typeof params.username === 'string' ? params.username : '';
  const user = mockUsers[username] || mockUsers['me']; // Fallback to 'me' for dynamic routes
  
  const myUsername = loggedInUser?.email?.split('@')[0];
  const isMe = username === myUsername;

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find a profile for "{username}".</p>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    )
  }

  const handleMessage = () => {
    toast({
      title: 'Message Sent!',
      description: `Your message to ${user.name} has been sent.`,
    });
  };

  return (
    <div className="bg-secondary/20 min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft />
              </Button>
              <div className="ml-4">
                  <h1 className="text-xl font-bold">{user.name}</h1>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
          </div>
      </header>
      <main className="flex-grow">
        {/* Banner and Profile Header */}
        <div className="container max-w-5xl mx-auto -mb-24">
            <div className="h-48 md:h-64 relative">
                <Image src={user.banner} alt={`${user.name}'s banner`} layout='fill' objectFit='cover' className='rounded-b-lg' data-ai-hint={user.bannerHint}/>
            </div>
            <div className="px-4 sm:px-8 relative">
                 <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 z-20">
                     <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background ring-4 ring-primary flex-shrink-0">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                        <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow w-full text-center sm:text-left">
                        <h2 className="text-3xl font-bold font-headline">{user.name}</h2>
                        <p className="text-muted-foreground">@{user.username}</p>
                        <div className="flex justify-center sm:justify-start gap-4 mt-2 text-sm">
                            <span className="font-semibold">{user.friends}</span> Friends
                            <span className="font-semibold">{user.followers}</span> Followers
                        </div>
                    </div>
                     <div className="flex gap-2 flex-shrink-0">
                        <InteractionButtons isMe={isMe} isFriend={false} isRequestSent={true} />
                        {!isMe && <QuickChatDialog userName={user.name} onSend={handleMessage} />}
                    </div>
                 </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pt-28">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-bold font-headline mb-4">About Me</h3>
                            <p className="text-sm text-muted-foreground">{user.bio}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-bold font-headline mb-4">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.interests.map((interest: string) => (
                                    <div key={interest} className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">{interest}</div>
                                ))}
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
                                <p>{user.name} hasn't hosted any events yet.</p>
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
                                    <p>{user.name} hasn't added any photos yet.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

    