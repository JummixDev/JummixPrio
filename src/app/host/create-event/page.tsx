
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEvent } from '@/app/actions';
import { createEventSchema, CreateEventInput } from '@/lib/schemas';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar as CalendarIcon, Loader2, TrendingUp, Users, Goal, DollarSign, Image as ImageIcon } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import NextImage from 'next/image';

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


export default function CreateEventPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<CreateEventInput>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            name: '',
            location: '',
            description: '',
            price: 0,
            image: '',
            hostUid: user?.uid,
            capacity: 100,
            expenses: 500,
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                setImagePreview(dataUrl);
                form.setValue('image', dataUrl, { shouldValidate: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: CreateEventInput) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to create an event.' });
            return;
        }

        const eventData: CreateEventInput = {
            ...values,
            hostUid: user.uid,
        };

        const result = await createEvent(eventData);

        if (result.success) {
            toast({
                title: 'Event Created!',
                description: 'Your event has been successfully published.',
            });
            router.push(`/event/${result.eventId}`);
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed to Create Event',
                description: result.errors?.join(', ') || 'An unknown error occurred.',
            });
        }
    };

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
                        <CardTitle className="font-headline text-2xl">Create a New Event</CardTitle>
                        <CardDescription>Fill in the details below to get your event up and running.</CardDescription>
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
                                            <FormItem>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                     <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Event Image</FormLabel>
                                                <FormControl>
                                                     <div>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                            accept="image/*"
                                                        />
                                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                                            <ImageIcon className="mr-2 h-4 w-4" />
                                                            Upload Image
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <div>
                                        {imagePreview && (
                                            <div className="mt-2 space-y-2">
                                                 <Label>Image Preview</Label>
                                                 <div className="aspect-video relative w-full rounded-md overflow-hidden border">
                                                    <NextImage src={imagePreview} alt="Event image preview" layout="fill" objectFit="cover" />
                                                 </div>
                                            </div>
                                        )}
                                     </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                     
                                </div>

                                <ProfitabilityCalculator form={form} />

                                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                                    {form.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : 'Publish Event'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
