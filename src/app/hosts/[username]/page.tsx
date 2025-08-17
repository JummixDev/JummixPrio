
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Loader2, Star, MessageSquare, Plus, UserPlus, Building, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/jummix/EventCard';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs, limit, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReviewInput, reviewSchema } from '@/lib/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { submitReview } from '@/app/actions';

const StarRating = ({ rating, setRating, interactive = false }: { rating: number, setRating?: (r: number) => void, interactive?: boolean }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-5 h-5 transition-colors ${interactive ? 'cursor-pointer' : ''} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                    onClick={() => interactive && setRating?.(star)}
                />
            ))}
        </div>
    );
};

const ReviewForm = ({ hostId }: { hostId: string }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);

    const form = useForm<Omit<ReviewInput, 'hostId' | 'reviewerId'>>({
        resolver: zodResolver(reviewSchema.omit({ hostId: true, reviewerId: true })),
        defaultValues: { rating: 0, comment: '' },
    });

    useEffect(() => {
        form.setValue('rating', rating);
    }, [rating, form]);

    const onSubmit = async (values: Omit<ReviewInput, 'hostId' | 'reviewerId'>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to leave a review.' });
            return;
        }
        if (values.rating === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a star rating.' });
            return;
        }
        
        const result = await submitReview({ ...values, hostId, reviewerId: user.uid });
        if (result.success) {
            toast({ title: 'Review Submitted!', description: 'Thank you for your feedback.' });
            form.reset();
            setRating(0);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.errors?.join(', ') || 'Failed to submit review.' });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
                <CardDescription>Share your experience with this host.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Rating</FormLabel>
                                    <FormControl>
                                        <StarRating rating={rating} setRating={setRating} interactive />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Comment</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe your experience..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Review
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default function HostProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const [hostUser, setHostUser] = useState<any>(null);
  const [hostEvents, setHostEvents] = useState<any[]>([]);
  const [hostReviews, setHostReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const username = typeof params.username === 'string' ? params.username : '';

  useEffect(() => {
    async function fetchHostProfile() {
        if (!username) return;
        setLoading(true);
        
        try {
            // 1. Fetch Host User Data
            const usersRef = collection(db, "users");
            const qUser = query(usersRef, where("username", "==", username), where("isVerifiedHost", "==", true), limit(1));
            const userSnapshot = await getDocs(qUser);

            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();
                setHostUser({ ...userData, id: userDoc.id });

                // 2. Fetch Host's Events
                const eventsRef = collection(db, "events");
                const qEvents = query(eventsRef, where("hostUid", "==", userDoc.id));
                const eventsSnapshot = await getDocs(qEvents);
                setHostEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                // 3. Fetch Host's Reviews
                const reviewsRef = collection(db, `users/${userDoc.id}/reviews`);
                const qReviews = query(reviewsRef, orderBy('createdAt', 'desc'));
                const reviewsSnapshot = await getDocs(qReviews);
                setHostReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            } else {
                 setHostUser(null);
            }
        } catch (error) {
            console.error("Error fetching host profile:", error);
            setHostUser(null);
        } finally {
            setLoading(false);
        }
    }
    fetchHostProfile();
  }, [username]);

  if (loading || authLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold font-headline text-primary">Loading Host Profile...</h1>
        </div>
    );
  }

  if (!hostUser) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-4xl font-bold mb-4">Host Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find a host profile for "{username}".</p>
            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    )
  }
  
  const isMe = loggedInUser?.uid === hostUser.uid;

  return (
    <div className="bg-secondary/20 min-h-screen">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft />
                </Link>
              </Button>
              <div className="ml-4">
                  <h1 className="text-xl font-bold">{hostUser.displayName}</h1>
                  <p className="text-sm text-muted-foreground">@{hostUser.username}</p>
              </div>
          </div>
      </header>
      <main className="flex-grow">
        <div className="container max-w-5xl mx-auto">
            {/* Banner */}
            <div className="h-48 md:h-64 relative rounded-b-lg overflow-hidden bg-muted">
                <Image src={hostUser.bannerURL || 'https://placehold.co/1000x300.png'} alt={`${hostUser.displayName}'s banner`} layout='fill' objectFit='cover' data-ai-hint={hostUser.bannerHint || 'abstract background'}/>
            </div>

            {/* Profile Header */}
             <div className="relative px-4 sm:px-8 z-20">
                 <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-24 sm:-mt-20">
                     <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background ring-4 ring-primary flex-shrink-0 -mt-12 sm:-mt-0">
                        <AvatarImage src={hostUser.photoURL || 'https://placehold.co/128x128.png'} alt={hostUser.displayName} data-ai-hint="person portrait" />
                        <AvatarFallback>{hostUser.displayName.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow w-full text-center sm:text-left pt-4 sm:pt-0">
                        <h2 className="text-3xl font-bold font-headline">{hostUser.displayName}</h2>
                        <p className="text-muted-foreground">@{hostUser.username}</p>
                        <div className="flex justify-center sm:justify-start gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> 4.8 (120 Reviews)</span>
                            <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {hostEvents.length} Events Hosted</span>
                        </div>
                    </div>
                     <div className="flex gap-2 flex-shrink-0">
                        {isMe ? (
                            <Button asChild variant="outline"><Link href="/host/dashboard"><Edit className="mr-2"/>Host Dashboard</Link></Button>
                        ) : (
                           <>
                             <Button><UserPlus className="mr-2"/> Follow</Button>
                             <Button><MessageSquare className="mr-2"/>Message</Button>
                           </>
                        )}
                    </div>
                 </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8 pt-8">
                <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events" className="py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {hostEvents.length > 0 ? (
                                hostEvents.map(event => <EventCard key={event.id} event={event} />)
                            ) : (
                                <p className="text-muted-foreground col-span-full text-center">This host has no upcoming events.</p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="reviews" className="py-6 space-y-6">
                       {!isMe && <ReviewForm hostId={hostUser.id} />}
                        <div className="space-y-4">
                           {hostReviews.length > 0 ? (
                               hostReviews.map(review => (
                                   <Card key={review.id}>
                                       <CardContent className="p-4 flex gap-4 items-start">
                                            <Avatar>
                                                <AvatarImage src={'https://placehold.co/40x40.png'} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div>
                                               <div className="flex items-center gap-4 mb-1">
                                                    <p className="font-semibold">{'Anonymous'}</p>
                                                    <StarRating rating={review.rating} />
                                               </div>
                                               <p className="text-muted-foreground text-sm">{review.comment}</p>
                                            </div>
                                       </CardContent>
                                   </Card>
                               ))
                           ) : (
                               <p className="text-muted-foreground text-center">This host has no reviews yet.</p>
                           )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
      </main>
    </div>
  );
}
    