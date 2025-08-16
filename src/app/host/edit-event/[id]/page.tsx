
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEvent } from '@/app/actions';
import { updateEventSchema, UpdateEventInput } from '@/lib/schemas';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type EventData = {
  id: string;
  [key: string]: any;
};

export default function EditEventPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;
    const { toast } = useToast();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm<UpdateEventInput>({
        resolver: zodResolver(updateEventSchema),
    });

    useEffect(() => {
        async function fetchEvent() {
            if (!eventId) return;
            try {
                const eventDoc = await getDoc(doc(db, 'events', eventId));
                if (eventDoc.exists()) {
                    const data = eventDoc.data();
                    setEvent({ id: eventDoc.id, ...data });
                    // Set form default values once data is fetched
                    form.reset({
                        eventId: eventDoc.id,
                        name: data.name,
                        date: new Date(data.date),
                        location: data.location,
                        description: data.description,
                        price: data.price,
                        image: data.image,
                    });
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'Event not found.' });
                    router.push('/host/dashboard');
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to load event data.' });
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [eventId, router, toast, form]);


    const onSubmit = async (values: UpdateEventInput) => {
        const result = await updateEvent(values);

        if (result.success) {
            toast({
                title: 'Event Updated!',
                description: 'Your event has been successfully updated.',
            });
            router.push(`/host/dashboard`);
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed to Update Event',
                description: result.errors?.join(', ') || 'An unknown error occurred.',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }
    
    if (!event) {
        // This case is handled by the redirect in useEffect, but as a fallback:
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Event could not be loaded.</p>
            </div>
        );
    }

    return (
        <div className="bg-secondary/20 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/host/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Host Dashboard
                    </Link>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Edit Event</CardTitle>
                        <CardDescription>Update the details for your event below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Summer Music Festival" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Event Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date()}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Central Park, NYC" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell everyone what makes your event special..."
                                                    className="resize-y min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ticket Price ($)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Enter 0 for a free event" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Image URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://placehold.co/600x400.png" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                                    {form.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : 'Save Changes'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    