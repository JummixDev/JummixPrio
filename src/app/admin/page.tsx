
'use client';

import { useState } from 'react';
import { BarChart, Users, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// IMPORTANT: This is a placeholder for a real admin check.
// In a production app, you would fetch the user's role from your database
// and protect this route on the server-side.
const ADMIN_UIDS = ['ADMIN_USER_UID_HERE']; // Replace with actual Admin User IDs from Firebase Auth

const mockUsers = [
    { id: 'user-1', name: 'Carlos Ray', email: 'carlos.ray@example.com', events: 42, status: 'Active' },
    { id: 'user-2', name: 'Jenna Smith', email: 'jenna.smith@example.com', events: 35, status: 'Active' },
    { id: 'user-3', name: 'Alex Doe', email: 'alex.doe@example.com', events: 73, status: 'Banned' },
    { id: 'user-4', name: 'Aisha Khan', email: 'aisha.khan@example.com', events: 50, status: 'Active' },
];

function Statistics() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+5.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">582</div>
                    <p className="text-xs text-muted-foreground">+12.3% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 waiting for review</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Verification Requests</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">Needs admin approval</p>
                </CardContent>
            </Card>
        </div>
    )
}

function UserManagement() {
    const { toast } = useToast();
    const [users, setUsers] = useState(mockUsers);

    const handleBan = (userId: string) => {
        setUsers(users.map(u => u.id === userId ? {...u, status: 'Banned'} : u));
        toast({ title: 'User Banned', description: `User ${userId} has been banned.`});
    }

    const handleUnban = (userId: string) => {
        setUsers(users.map(u => u.id === userId ? {...u, status: 'Active'} : u));
        toast({ title: 'User Unbanned', description: `User ${userId} has been unbanned.`});
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View, manage, and moderate platform users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Events Attended</TableHead>
                             <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                             <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-center">{user.events}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     {user.status === 'Active' ? (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">Ban User</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure you want to ban {user.name}?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will prevent them from accessing the platform. This action can be reversed.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleBan(user.id)} className="bg-destructive hover:bg-destructive/90">Confirm Ban</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                     ) : (
                                         <Button onClick={() => handleUnban(user.id)} variant="outline" size="sm">Unban</Button>
                                     )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function Reports() {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review and take action on user-reported content.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Reported content management will be available here soon.</p>
            </CardContent>
        </Card>
    )
}

function Verifications() {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Host Verifications</CardTitle>
                <CardDescription>Approve or deny requests from users to become verified event hosts.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Host verification management will be available here soon.</p>
            </CardContent>
        </Card>
    )
}


export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('stats');
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to home
                router.push('/');
            } else if (!ADMIN_UIDS.includes(user.uid)) {
                // Logged in but not an admin, show access denied
                setIsAdmin(false);
            } else {
                 // It's an admin!
                setIsAdmin(true);
            }
        }
    }, [user, loading, router]);

    const navItems = [
        { id: 'stats', label: 'Statistics', icon: BarChart },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'reports', label: 'Reports', icon: ShieldAlert },
        { id: 'verifications', label: 'Verifications', icon: CheckCircle },
    ]

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAdmin) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <ShieldAlert className="w-16 h-16 mb-4 text-destructive" />
                <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
                <p className="text-muted-foreground mb-8">You do not have permission to view this page.</p>
                <Button asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen">
            <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                        <ArrowLeft />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Admin Dashboard</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
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
                    <section className="md:col-span-3 space-y-8">
                        {activeSection === 'stats' && <Statistics />}
                        {activeSection === 'users' && <UserManagement />}
                        {activeSection === 'reports' && <Reports />}
                        {activeSection === 'verifications' && <Verifications />}
                    </section>
                </div>
            </main>
        </div>
    )
}
