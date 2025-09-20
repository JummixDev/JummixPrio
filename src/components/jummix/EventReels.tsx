
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlusCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, getDocs, where, documentId } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Story = {
  id: string;
  userId: string;
  imageUrl: string;
  createdAt: any;
  user?: {
    name: string;
    avatar: string;
    hint: string;
  }
};

export function EventReels() {
  const { userData } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isAdmin = userData?.email === 'service@jummix.com';
  const isVerifiedHost = userData?.isVerifiedHost || false;
  
  useEffect(() => {
    const storiesQuery = query(
      collection(db, "stories"), 
      orderBy("createdAt", "desc"), 
      limit(10)
    );

    const unsubscribe = onSnapshot(storiesQuery, async (snapshot) => {
      const fetchedStories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
      
      if (fetchedStories.length > 0) {
        // Get user data for each story
        const userIds = [...new Set(fetchedStories.map(story => story.userId))];
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, where(documentId(), 'in', userIds));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = Object.fromEntries(usersSnapshot.docs.map(doc => [doc.id, doc.data()]));

        // Attach user data to stories
        const storiesWithUsers = fetchedStories.map(story => ({
          ...story,
          user: {
            name: usersData[story.userId]?.displayName || 'Unknown',
            avatar: usersData[story.userId]?.photoURL || '',
            hint: usersData[story.userId]?.hint || 'person portrait',
          }
        }));
        setStories(storiesWithUsers);
      } else {
        setStories([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  return (
    <Card>
          <CardHeader>
              <CardTitle className="font-headline">Event Stories</CardTitle>
              <CardDescription>Exclusive highlights from verified hosts. Promote your event here!</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex items-center gap-4 overflow-x-auto pb-4">
                  {(isVerifiedHost || isAdmin) && (
                      <Link href="/story/create" className="flex flex-col items-center gap-2 cursor-pointer text-center text-primary hover:text-primary/80 w-20 flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary">
                              <PlusCircle className="w-8 h-8" />
                          </div>
                          <span className="text-xs font-semibold">Add Story</span>
                      </Link>
                  )}
                  {loading ? (
                    <div className="flex items-center justify-center w-full">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    stories.map((story) => (
                      <div key={story.id} className="flex flex-col items-center gap-2 text-center flex-shrink-0 cursor-pointer group">
                        <div className="relative w-16 h-16">
                              <Avatar className="w-full h-full border-2 border-transparent group-hover:border-primary transition-colors">
                                  <AvatarImage src={story.user?.avatar} alt={story.user?.name} data-ai-hint={story.user?.hint}/>
                                  <AvatarFallback>{story.user?.name?.substring(0,2)}</AvatarFallback>
                              </Avatar>
                              <div className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-card ring-purple-500 group-hover:ring-purple-400 transition-all"/>
                        </div>
                          <span className="text-xs font-medium w-16 truncate">{story.user?.name}</span>
                      </div>
                  ))
                  )}
                  {(!loading && stories.length === 0 && !(isVerifiedHost || isAdmin)) && (
                      <p className="text-sm text-muted-foreground">No stories posted yet.</p>
                  )}
              </div>
          </CardContent>
    </Card>
  );
}
