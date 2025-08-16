
'use client';

import { useState } from 'react';
import { ArrowLeft, BarChart, Calendar, CheckSquare, DollarSign, MessageCircle, PieChart, ShieldAlert, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, PieChart as RechartsPieChart } from 'recharts';

const mockEvents = [
    { id: 'evt-1', name: 'Summer Music Fest', date: '2024-08-15', status: 'Upcoming', bookings: 342, revenue: 25650 },
    { id: 'evt-2', name: 'Tech Innovators Summit', date: '2024-09-05', status: 'Upcoming', bookings: 180, revenue: 0 },
    { id: 'evt-3', name: 'The Color Run', date: '2024-06-20', status: 'Past', bookings: 512, revenue: 20480 },
];

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


function Overview() {
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

function EventManagement() {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>Manage your upcoming and past events.</CardDescription>
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
                        {mockEvents.map(event => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.name}</TableCell>
                                <TableCell>{event.date}</TableCell>
                                <TableCell>
                                    <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'}>{event.status}</Badge>
                                </TableCell>
                                <TableCell>{event.bookings}</TableCell>
                                <TableCell>${event.revenue.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Manage</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function ReviewManagement() {
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

function Communication() {
    return <Card><CardHeader><CardTitle>Communication</CardTitle></CardHeader><CardContent><p>Send messages to event group chats.</p></CardContent></Card>
}
function Finances() {
    return <Card><CardHeader><CardTitle>Finances</CardTitle></CardHeader><CardContent><p>Manage Stripe connection and payouts.</p></CardContent></Card>
}

function AccessDenied() {
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
    const { user, loading } = useAuth();
    const router = useRouter();
    // This would be fetched from your database in a real app
    const [isVerifiedHost, setIsVerifiedHost] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
        // In a real app, you'd fetch the user's custom claims or a field from their
        // Firestore document to set `isVerifiedHost`. For now, we'll simulate it.
        // For example:
        // const userDoc = await getUserDoc(user.uid);
        // setIsVerifiedHost(userDoc.isVerifiedHost);
        if (user && user.email === 'carlos.ray@example.com') {
             setIsVerifiedHost(true);
        }

    }, [user, loading, router]);
    
    if (loading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    return (
        <div className="bg-secondary/20 min-h-screen">
            <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Host Dashboard</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {isVerifiedHost ? (
                    <Tabs defaultValue="overview">
                        <TabsList className="grid w-full grid-cols-5 mb-6">
                            <TabsTrigger value="overview"><BarChart className="mr-2"/>Overview</TabsTrigger>
                            <TabsTrigger value="events"><Calendar className="mr-2"/>Events</TabsTrigger>
                            <TabsTrigger value="reviews"><Star className="mr-2"/>Reviews</TabsTrigger>
                            <TabsTrigger value="communication"><MessageCircle className="mr-2"/>Communication</TabsTrigger>
                            <TabsTrigger value="finances"><DollarSign className="mr-2"/>Finances</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview"><Overview/></TabsContent>
                        <TabsContent value="events"><EventManagement/></TabsContent>
                        <TabsContent value="reviews"><ReviewManagement/></TabsContent>
                        <TabsContent value="communication"><Communication/></TabsContent>
                        <TabsContent value="finances"><Finances/></TabsContent>
                    </Tabs>
                ) : (
                    <AccessDenied />
                )}
            </main>
        </div>
    )
}
