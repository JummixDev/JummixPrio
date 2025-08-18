

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart, Calendar, DollarSign, MessageCircle, PieChart, Star, Users, Loader2, Ticket, Archive, Image as ImageIcon, Zap, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, Pie, ResponsiveContainer, BarChart as RechartsBarChart, PieChart as RechartsPieChart } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type EventData = {
    id: string;
    name: string;
    date: string;
    status: 'Upcoming' | 'Past';
    bookings: number;
    revenue: number;
};

const mockReviews = [
    { id: 'rev-1', event: 'The Color Run', user: 'Jenna S.', rating: 5, comment: 'So much fun! Well organized.' },
    { id: 'rev-2', event: 'The Color Run', user: 'Mike L.', rating: 4, comment: 'Great event, but the lines for the color stations were a bit long.' },
];

const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
}

const pieChartData = [
  { name: '5 Stars', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: '4 Stars', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: '3 Stars', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: '2 Stars', value: 100, fill: 'hsl(var(--chart-4))' },
  { name: '1 Star', value: 50, fill: 'hsl(var(--chart-5))' },
];


export function Overview() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 since last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.8/5</div>
                        <p className="text-xs text-muted-foreground">Based on 1,204 reviews</p>
                    </CardContent>
                </Card>
            </div>
             <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings Overview</CardTitle>
                        <CardDescription>January - June 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <RechartsBarChart data={barChartData}>
                                <RechartsBarChart.CartesianGrid vertical={false} />
                                <RechartsBarChart.XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                />
                                <RechartsBarChart.YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <RechartsBarChart.Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <RechartsBarChart.Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </RechartsBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Review Score Distribution</CardTitle>
                         <CardDescription>All-time reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px] w-full">
                            <RechartsPieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={pieChartData} dataKey="value" nameKey="name" />
                                <ChartLegend content={<ChartLegendContent />} />
                            </RechartsPieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export function EventManagement() {
    const { user } = useAuth();
    const [events, setEvents] = useState<EventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchHostEvents() {
            if (!user) return;
            setIsLoading(true);
            try {
                const eventsRef = collection(db, 'events');
                const q = query(eventsRef, where('hostUid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                
                const hostEvents = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const eventDate = new Date(data.date);
                    return {
                        id: doc.id,
                        name: data.name,
                        date: eventDate.toLocaleDateString(),
                        status: eventDate > new Date() ? 'Upcoming' : 'Past',
                        bookings: data.attendees?.length || 0, 
                        revenue: (data.attendees?.length || 0) * data.price,
                    } as EventData;
                });
                setEvents(hostEvents);
            } catch (error) {
                console.error("Error fetching host events:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchHostEvents();
    }, [user]);

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>Loading your events...</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

     return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>Manage your upcoming and past events.</CardDescription>
                </div>
                <Button asChild>
                    <Link href="/host/create-event">Create New Event</Link>
                </Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Bookings</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length > 0 ? (
                            events.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.name}</TableCell>
                                    <TableCell>{event.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'}>{event.status}</Badge>
                                    </TableCell>
                                    <TableCell>{event.bookings}</TableCell>
                                    <TableCell>${event.revenue.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/host/edit-event/${event.id}`}>Manage</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground p-8">
                                    You haven't created any events yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export function ReviewManagement() {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>Read and respond to reviews for your events.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {mockReviews.map(review => (
                        <div key={review.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{review.user} on <span className="text-primary">{review.event}</span></p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {Array.from({length: 5}).map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                                        ))}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Reply</Button>
                            </div>
                            <p className="text-muted-foreground mt-2">{review.comment}</p>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
    )
}

export function Ticketing() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ticketing & Check-in</CardTitle>
                <CardDescription>Scan attendee tickets and manage event check-ins.</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Select an event from the 'Events' tab to access its check-in scanner.</p>
                <Button className="mt-4" asChild>
                    <Link href="#events">
                        <Calendar className="mr-2"/>
                        Go to My Events
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}

export function StoryManagement() {
  const { toast } = useToast();
  const handleBoostEvent = () => {
    toast({
        title: "Feature in Kürze verfügbar",
        description: "Die Möglichkeit, Events zu bewerben, wird bald implementiert.",
    })
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Story Management</CardTitle>
            <CardDescription>Manage your active stories, view your archive, and boost your events with promotional stories.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-secondary/50 flex flex-col items-center justify-center p-6 text-center">
                 <h3 className="font-bold mb-2">Create & Archive</h3>
                <p className="text-muted-foreground text-sm mb-4">Engage your followers with new stories or look back at your past successes.</p>
                 <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/story/create">
                            <ImageIcon className="mr-2"/> Create New
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/story/archive">
                            <Archive className="mr-2"/> View Archive
                        </Link>
                    </Button>
                 </div>
            </Card>
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/50 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="font-bold mb-2 flex items-center gap-2"><Zap className="text-primary"/> Promote an Event</h3>
                <p className="text-muted-foreground text-sm mb-4">Feature your event in the main story feed to maximize visibility and ticket sales.</p>
                <Button onClick={handleBoostEvent} className="bg-primary/90 hover:bg-primary">
                    <Zap className="mr-2"/> Boost an Event
                </Button>
            </Card>
        </CardContent>
    </Card>
  )
}


export function Communication() {
    const { toast } = useToast();
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;
        toast({
            title: "Message Sent!",
            description: "Your message has been broadcast to all event group chats."
        });
        setMessage('');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>Send messages to your event group chats. Use this for important announcements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your announcement here..."
                    rows={4}
                />
                <Button onClick={handleSend} disabled={!message.trim()}>Send to All Event Chats</Button>
            </CardContent>
        </Card>
    )
}
export function Finances() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Finances</CardTitle>
                <CardDescription>Manage Stripe connection and view payouts.</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Stripe integration not yet configured.</p>
                <Button className="mt-4">Connect with Stripe</Button>
            </CardContent>
        </Card>
    )
}

export function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background text-center p-4 rounded-lg border-2 border-dashed">
            <ShieldAlert className="w-16 h-16 mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6 max-w-md">You are not a verified host. To create and manage events, you need to apply for host verification.</p>
            <Button asChild>
                <Link href="/host/apply-verification">Apply to be a Host</Link>
            </Button>
        </div>
    )
}


export default function HostDashboardPage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('overview');
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    useEffect(() => {
        if (!loading && userData !== undefined) {
            if (!user) {
                router.push('/');
            } else {
                const isAdmin = user.email === 'service@jummix.com';
                const isVerifiedHost = userData?.isVerifiedHost || false;
                if (isAdmin || isVerifiedHost) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            }
        }
    }, [user, userData, loading, router]);

    const navItems = [
        { id: 'overview', label: 'Overview', icon: BarChart },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'stories', label: 'Stories', icon: ImageIcon },
        { id: 'ticketing', label: 'Ticketing', icon: Ticket },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'communication', label: 'Communication', icon: MessageCircle },
        { id: 'finances', label: 'Finances', icon: DollarSign },
    ];
    
    if (loading || userData === undefined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Lade Ihr Erlebnis mit Jummix</h1>
            </div>
        );
    }
    
    return (
        <div className="bg-secondary/20 min-h-screen">
            <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Host Dashboard</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-16">
                {isAuthorized ? (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        <aside className="lg:col-span-1 lg:sticky top-36">
                             <nav className="flex flex-col space-y-2">
                                {navItems.map(item => (
                                    <Button 
                                        key={item.id}
                                        variant={activeSection === item.id ? "secondary" : "ghost"}
                                        className="justify-start"
                                        onClick={() => setActiveSection(item.id)}
                                    >
                                        <item.icon className="mr-2 h-4 w-4"/>
                                        {item.label}
                                    </Button>
                                ))}
                            </nav>
                        </aside>
                        <section className="lg:col-span-3 space-y-8">
                            {activeSection === 'overview' && <Overview />}
                            {activeSection === 'events' && <EventManagement />}
                            {activeSection === 'stories' && <StoryManagement />}
                            {activeSection === 'ticketing' && <Ticketing />}
                            {activeSection === 'reviews' && <ReviewManagement />}
                            {activeSection === 'communication' && <Communication />}
                            {activeSection === 'finances' && <Finances />}
                        </section>
                    </div>
                ) : (
                    <AccessDenied />
                )}
            </main>
        </div>
    )
}
