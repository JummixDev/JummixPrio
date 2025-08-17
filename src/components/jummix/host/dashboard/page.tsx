

'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart, Calendar, DollarSign, MessageCircle, Star, Users, Loader2, Ticket, Archive, Image as ImageIcon, Zap } from 'lucide-react';
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
import { AccessDenied, EventManagement, Finances, Communication, Overview, ReviewManagement, StoryManagement, Ticketing } from '@/app/host/dashboard/page';


export default function HostDashboardPage() {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
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
            <header className="bg-card/80 backdrop-blur-lg border-b sticky top-20 z-20">
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
                {isAuthorized ? (
                    <Tabs defaultValue="overview">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 mb-6">
                            <TabsTrigger value="overview"><BarChart className="mr-2 hidden md:block"/>Overview</TabsTrigger>
                            <TabsTrigger value="events"><Calendar className="mr-2 hidden md:block"/>Events</TabsTrigger>
                             <TabsTrigger value="stories"><ImageIcon className="mr-2 hidden md:block"/>Stories</TabsTrigger>
                            <TabsTrigger value="ticketing"><Ticket className="mr-2 hidden md:block"/>Ticketing</TabsTrigger>
                            <TabsTrigger value="reviews"><Star className="mr-2 hidden md:block"/>Reviews</TabsTrigger>
                            <TabsTrigger value="communication"><MessageCircle className="mr-2 hidden md:block"/>Communication</TabsTrigger>
                            <TabsTrigger value="finances"><DollarSign className="mr-2 hidden md:block"/>Finances</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview"><Overview/></TabsContent>
                        <TabsContent value="events"><EventManagement/></TabsContent>
                        <TabsContent value="stories"><StoryManagement /></TabsContent>
                        <TabsContent value="ticketing"><Ticketing /></TabsContent>
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
