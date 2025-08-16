
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Cake, VenetianMask, MapPin, Users, Award, Rss, CalendarCheck, Camera } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/jummix/Footer';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/jummix/EventCard';
import Image from 'next/image';

const mockUsers: { [key: string]: any } = {
  carlosray: {
    name: 'Carlos Ray',
    username: 'carlosray',
    avatar: 'https://placehold.co/128x128.png',
    hint: 'man portrait',
    bio: 'Tech enthusiast and serial entrepreneur. Always looking for the next big thing. Love to connect with like-minded people at tech summits and hackathons.',
    age: 32,
    gender: 'Male',
    location: 'San Francisco, CA',
    interests: ['Technology', 'Startups', 'AI', 'Rock Music', 'Coffee'],
    eventsAttended: 42,
    friendsCount: 212,
  },
  jennasmith: {
    name: 'Jenna Smith',
    username: 'jennasmith',
    avatar: 'https://placehold.co/128x128.png',
    hint: 'woman portrait',
    bio: 'Designer and artist. My passion is creating beautiful and intuitive user experiences. In my free time, you can find me at art galleries, music festivals, or hiking.',
    age: 28,
    gender: 'Female',
    location: 'New York, NY',
    interests: ['Design', 'Art', 'Music Festivals', 'Hiking', 'Photography'],
    eventsAttended: 35,
    friendsCount: 189,
  },
  alexdoe: {
    name: 'Alex Doe',
    username: 'alexdoe',
    avatar: 'https://placehold.co/128x128.png',
    hint: 'person portrait',
    bio: 'A mystery wrapped in an enigma. Shows up at the coolest events, knows everyone, but says little. What will they do next?',
    age: 'N/A',
    gender: 'Non-binary',
    location: 'Everywhere & Nowhere',
    interests: ['Spontaneity', 'Live Music', 'Art Installations', 'Good Vibes'],
    eventsAttended: 73,
    friendsCount: 500,
  },
   aishakhan: {
    name: 'Aisha Khan',
    username: 'aishakhan',
    avatar: 'https://placehold.co/128x128.png',
    hint: 'woman face',
    bio: 'Food blogger and culinary adventurer. I travel the world one bite at a time. My goal is to visit every Michelin-starred restaurant!',
    age: 29,
    gender: 'Female',
    location: 'London, UK',
    interests: ['Food', 'Travel', 'Blogging', 'Wine Tasting', 'Cooking'],
    eventsAttended: 50,
    friendsCount: 320,
  },
  davidlee: {
    name: 'David Lee',
    username: 'davidlee',
    avatar: 'https://placehold.co/128x128.png',
    hint: 'man face',
    bio: 'Software engineer by day, musician by night. I love playing guitar and attending open mic nights. Let\'s jam sometime!',
    age: 26,
    gender: 'Male',
    location: 'Austin, TX',
    interests: ['Music', 'Coding', 'Guitar', 'Video Games', 'Craft Beer'],
    eventsAttended: 22,
    friendsCount: 150,
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

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const username = typeof params.username === 'string' ? params.username : '';
  const user = mockUsers[username];

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find a profile for "{username}".</p>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    )
  }

  const handleFollow = () => {
    toast({
      title: 'Now Following!',
      description: `You are now following ${user.name}.`,
    });
  };

  const handleMessage = () => {
    toast({
      title: 'Message Sent!',
      description: `Your message to ${user.name} has been sent.`,
    });
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft />
              </Button>
              <h1 className="text-xl font-bold ml-4">{user.name}'s Profile</h1>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <Card className="max-w-4xl mx-auto overflow-hidden">
            <CardHeader className="bg-secondary/50 p-8 flex flex-col md:flex-row items-center gap-8">
                <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.hint} />
                    <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-grow">
                    <CardTitle className="text-4xl font-headline">{user.name}</CardTitle>
                    <CardDescription className="text-lg">@{user.username}</CardDescription>
                    <p className="text-sm mt-4 max-w-prose">{user.bio}</p>
                    <div className="flex justify-center md:justify-start gap-4 mt-4">
                        <Button onClick={handleFollow}>Follow</Button>
                        <Button onClick={handleMessage} variant="outline">Message</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="attended" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-none">
                        <TabsTrigger value="hosted" className="rounded-none"><Rss className="mr-2"/> Hosted</TabsTrigger>
                        <TabsTrigger value="attended" className="rounded-none"><CalendarCheck className="mr-2"/> Attended</TabsTrigger>
                        <TabsTrigger value="gallery" className="rounded-none"><Camera className="mr-2"/> Gallery</TabsTrigger>
                    </TabsList>
                    <TabsContent value="hosted" className="p-6">
                         <div className="text-center text-muted-foreground py-8">
                            <p>{user.name} hasn't hosted any events yet.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="attended" className="p-6 bg-secondary/30">
                        <h3 className="text-lg font-bold font-headline mb-4">Events Attended by {user.name}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {mockAttendedEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                           ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="gallery" className="p-6">
                        <h3 className="text-lg font-bold font-headline mb-4">Photo Gallery</h3>
                        {mockGallery.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
