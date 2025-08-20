
'use client';

import { useState } from 'react';
import { BarChart, Users, ShieldAlert, CheckCircle, ArrowLeft, MoreHorizontal, FileText, BadgeHelp, Check, X, Loader2 } from 'lucide-react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ADMIN_EMAIL = 'service@jummix.com';

const mockUsers = [
    { id: 'user-1', name: 'Carlos Ray', email: 'carlos.ray@example.com', events: 42, status: 'Active', isHost: true },
    { id: 'user-2', name: 'Jenna Smith', email: 'jenna.smith@example.com', events: 35, status: 'Active', isHost: false },
    { id: 'user-3', name: 'Alex Doe', email: 'alex.doe@example.com', events: 73, status: 'Banned', isHost: true },
    { id: 'user-4', name: 'Aisha Khan', email: 'aisha.khan@example.com', events: 50, status: 'Active', isHost: false },
];

const mockReports = [
    { id: 'rep-1', type: 'Event', item: 'Underground Rave Party', reason: 'Illegal Activity', status: 'Pending Review' },
    { id: 'rep-2', type: 'Profile', item: '@spammer', reason: 'Spam Account', status: 'Resolved' },
    { id: 'rep-3', type: 'Activity', item: 'Hate speech comment', reason: 'Harassment', status: 'Pending Review' },
];

const mockVerificationRequests = [
    { id: 'ver-1', name: 'Aisha Khan', email: 'aisha.khan@example.com', date: '2024-07-20' },
    { id: 'ver-2', name: 'David Lee', email: 'david.lee@example.com', date: '2024-07-19' },
]


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

    const handleHostRevoke = (userId: string) => {
        setUsers(users.map(u => u.id === userId ? {...u, isHost: false} : u));
        toast({ title: 'Host Rights Revoked', description: `User ${userId} is no longer a host.`});
    }
     const handleDelete = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
        toast({ title: 'User Deleted', description: `User ${userId} has been deleted.`});
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
                             <TableHead>Host Status</TableHead>
                             <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                             <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.isHost ? 'Yes' : 'No'}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            {user.status === 'Active' ? (
                                                <DropdownMenuItem onClick={() => handleBan(user.id)} className="text-destructive">Ban User</DropdownMenuItem>
                                             ) : (
                                                 <DropdownMenuItem onClick={() => handleUnban(user.id)}>Unban User</DropdownMenuItem>
                                             )}
                                             {user.isHost && <DropdownMenuItem onClick={() => handleHostRevoke(user.id)} className="text-destructive">Revoke Host Rights</DropdownMenuItem>}
                                              <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">Delete User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Reported Item</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        {mockReports.map(report => (
                             <TableRow key={report.id}>
                                <TableCell>{report.type}</TableCell>
                                <TableCell className="font-medium">{report.item}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>
                                    <Badge variant={report.status === 'Pending Review' ? 'default' : 'secondary'}>{report.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                     </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function Verifications() {
    const { toast } = useToast();
    const [requests, setRequests] = useState(mockVerificationRequests);

    const handleApprove = (reqId: string) => {
        setRequests(requests.filter(req => req.id !== reqId));
        toast({ title: 'Host Approved', description: 'The user has been granted host privileges.' });
    };

    const handleDeny = (reqId: string) => {
        setRequests(requests.filter(req => req.id !== reqId));
        toast({ variant: 'destructive', title: 'Host Denied', description: 'The user\'s request has been denied.' });
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle>Host Verifications</CardTitle>
                <CardDescription>Approve or deny requests from users to become verified event hosts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                             <TableHead>Request Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        {requests.map(req => (
                             <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.name}</TableCell>
                                <TableCell>{req.email}</TableCell>
                                <TableCell>{req.date}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button onClick={() => handleApprove(req.id)} variant="outline" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700">
                                        <Check className="w-4 h-4"/>
                                    </Button>
                                    <Button onClick={() => handleDeny(req.id)} variant="outline" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700">
                                        <X className="w-4 h-4"/>
                                    </Button>
                                    <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2"/>View Application</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                     </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('stats');
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Wait until loading is false before we check for user and their role.
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to home.
                router.push('/');
            } else if (user.email !== ADMIN_EMAIL) {
                // Logged in but not an admin, deny access.
                setIsAuthorized(false);
            } else {
                 // It's the admin! Authorize access.
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    const navItems = [
        { id: 'stats', label: 'Statistics', icon: BarChart },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'reports', label: 'Reports', icon: ShieldAlert },
        { id: 'verifications', label: 'Verifications', icon: CheckCircle },
    ]

    // Show a loading state while we verify auth.
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Loading your Jummix experience</h1>
            </div>
        );
    }
    
    // Once loading is complete, show either the dashboard or access denied.
    if (!isAuthorized) {
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
        <div className="bg-secondary/20 min-h-screen">
            <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                        <ArrowLeft />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Admin Dashboard</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <aside className="lg:col-span-1 lg:sticky lg:top-36">
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
