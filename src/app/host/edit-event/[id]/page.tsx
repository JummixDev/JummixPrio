
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEvent } from '@/app/actions';
import { updateEventSchema, UpdateEventInput } from '@/lib/schemas';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar as CalendarIcon, Loader2, TrendingUp, Goal, DollarSign, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

type EventData = {
  id: string;
  [key: string]: any;
};

function ProfitabilityCalculator({ form }: { form: any }) {
    const [minAttendees, setMinAttendees] = useState(0);
    const [breakEvenRevenue, setBreakEvenRevenue] = useState(0);
    const [potentialProfit, setPotentialProfit] = useState(0);

    const price = form.watch('price');
    const expenses = form.watch('expenses');
    const capacity = form.watch('capacity');

    useEffect(() => {
        const priceNum = parseFloat(price) || 0;
        const expensesNum = parseFloat(expenses) || 0;
        const capacityNum = parseInt(capacity, 10) || 0;

        if (priceNum > 0) {
            const min = Math.ceil(expensesNum / priceNum);
            setMinAttendees(min);
            setBreakEvenRevenue(min * priceNum);
        } else {
            setMinAttendees(0);
            setBreakEvenRevenue(0);
        }
        
        if (capacityNum > 0) {
            setPotentialProfit((capacityNum * priceNum) - expensesNum);
        } else {
            setPotentialProfit(0);
        }

    }, [price, expenses, capacity]);

    if (!expenses || expenses <= 0) return null;

    return (
        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><TrendingUp /> Profitability Analysis</CardTitle>
                <CardDescription>Real-time calculation based on your inputs. Does not yet include platform service fees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-background p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Min. Attendees</p>
                        <p className="text-xl font-bold flex items-center justify-center gap-2"><Goal/>{minAttendees}</p>
                    </div>
                     <div className="bg-background p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Break-Even</p>
                        <p className="text-xl font-bold flex items-center justify-center gap-1"><DollarSign className="w-5 h-5"/>{breakEvenRevenue.toFixed(2)}</p>
                    </div>
                     <div className="bg-background p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Max. Profit</p>
                        <p className={`text-xl font-bold flex items-center justify-center gap-1 ${potentialProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                           <DollarSign className="w-5 h-5"/>{potentialProfit.toFixed(2)}
                        </p>
                    </div>
                </div>
                 <div>
                    <Label className="text-xs">Capacity Fulfillment for Profit</Label>
                    <Progress value={(minAttendees / (parseInt(capacity, 10) || 1)) * 100} className="h-2 mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                        You need to sell {minAttendees} out of {parseInt(capacity, 10) || 0} tickets to cover your costs.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

function CheckInScanner() {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);

            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use the scanner.',
            });
          }
        };

        getCameraPermission();
        
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [toast]);
    
    return (
        <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><QrCode /> Live Check-in Scanner</CardTitle>
                <CardDescription>Scan attendee QR codes at the event entrance.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="aspect-video bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Alert variant="destructive" className="m-4">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                    Please allow camera access in your browser settings to use this feature.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                 </div>
            </CardContent>
        </Card>
    )
}

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
                        capacity: data.capacity,
                        expenses: data.expenses,
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Lade Ihr Erlebnis mit Jummix</h1>
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
            <div className="w-full max-w-3xl space-y-6">
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
                                     <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ticket Price (€)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Enter 0 for a free event" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <FormField
                                        control={form.control}
                                        name="expenses"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total Expenses (€)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 1500" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Max. Capacity</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 200" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <ProfitabilityCalculator form={form} />

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

                <CheckInScanner />
            </div>
        </div>
    );
}
