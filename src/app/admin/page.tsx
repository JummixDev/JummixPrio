
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Users, ShieldAlert, CheckCircle, ArrowLeft, MoreHorizontal, FileText, BadgeHelp, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateUserStatus, updateHostVerification } from '../actions';

const ADMIN_EMAIL = 'service@jummix.com';

type UserData = {
    uid: string;
    displayName: string;
    email: string;
    status: 'Active' | 'Banned';
    isVerifiedHost: boolean;
    hostApplicationStatus?: 'pending' | 'approved' | 'rejected' | 'none';
};

const mockReports = [
    { id: 'rep-1', type: 'Event', item: 'Underground Rave Party', reason: 'Illegal Activity', status: 'Pending Review' },
    { id: 'rep-2', type: 'Profile', item: '@spammer', reason: 'Spam Account', status: 'Resolved' },
    { id: 'rep-3', type: 'Activity', item: 'Hate speech comment', reason: 'Harassment', status: 'Pending Review' },
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

function UserManagement({allUsers, isLoading}: {allUsers: UserData[], isLoading: boolean}) {
    const { toast } = useToast();

    const handleAction = async (userId: string, action: 'ban' | 'unban' | 'revoke') => {
        const user = allUsers.find(u => u.uid === userId);
        if (!user) return;

        let result;
        if (action === 'ban') {
            result = await updateUserStatus(userId, 'Banned');
            if (result.success) toast({ title: 'User Banned', description: `User ${user.displayName} has been banned.`});
        } else if (action === 'unban') {
            result = await updateUserStatus(userId, 'Active');
            if (result.success) toast({ title: 'User Unbanned', description: `User ${user.displayName} has been unbanned.`});
        } else if (action === 'revoke') {
            result = await updateHostVerification(userId, 'revoke');
             if (result.success) toast({ title: 'Host Rights Revoked', description: `User ${user.displayName} is no longer a host.`});
        }
        
        if (result && !result.success) {
            toast({ variant: 'destructive', title: 'Action Failed', description: result.error});
        }
    }

    if (isLoading) {
        return <Card><CardHeader><CardTitle>User Management</CardTitle></CardHeader><CardContent><Loader2 className="animate-spin" /></CardContent></Card>
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
                        {allUsers.map(user => (
                             <TableRow key={user.uid}>
                                <TableCell className="font-medium">{user.displayName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.isVerifiedHost ? 'Yes' : 'No'}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>
                                        {user.status || 'Active'}
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
                                            {(user.status || 'Active') === 'Active' ? (
                                                <DropdownMenuItem onClick={() => handleAction(user.uid, 'ban')} className="text-destructive">Ban User</DropdownMenuItem>
                                             ) : (
                                                 <DropdownMenuItem onClick={() => handleAction(user.uid, 'unban')}>Unban User</DropdownMenuItem>
                                             )}
                                             {user.isVerifiedHost && <DropdownMenuItem onClick={() => handleAction(user.uid, 'revoke')} className="text-destructive">Revoke Host Rights</DropdownMenuItem>}
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

function Verifications({verificationRequests, isLoading}: {verificationRequests: UserData[], isLoading: boolean}) {
    const { toast } = useToast();

    const handleAction = async (userId: string, action: 'approve' | 'deny') => {
        const user = verificationRequests.find(u => u.uid === userId);
        if (!user) return;

        const result = await updateHostVerification(userId, action);
        
        if (result.success) {
            toast({ title: `Host ${action === 'approve' ? 'Approved' : 'Denied'}`, description: `The user ${user.displayName}'s request has been ${action}d.`});
        } else {
            toast({ variant: 'destructive', title: 'Action Failed', description: result.error});
        }
    };
    
    if (isLoading) {
        return <Card><CardHeader><CardTitle>Host Verifications</CardTitle></CardHeader><CardContent><Loader2 className="animate-spin" /></CardContent></Card>
    }

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
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        {verificationRequests.length > 0 ? (
                            verificationRequests.map(req => (
                                 <TableRow key={req.uid}>
                                    <TableCell className="font-medium">{req.displayName}</TableCell>
                                    <TableCell>{req.email}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button onClick={() => handleAction(req.uid, 'approve')} variant="outline" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700">
                                            <Check className="w-4 h-4"/>
                                        </Button>
                                        <Button onClick={() => handleAction(req.uid, 'deny')} variant="outline" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700">
                                            <X className="w-4 h-4"/>
                                        </Button>
                                        <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2"/>View Application</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={3} className="text-center p-8 text-muted-foreground">
                                    No pending verification requests.
                                </TableCell>
                            </TableRow>
                        )}
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
    
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [verificationRequests, setVerificationRequests] = useState<UserData[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        // Authorization check
        if (!loading) {
            if (!user) {
                router.push('/');
            } else if (user.email !== ADMIN_EMAIL) {
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);
    
     useEffect(() => {
        if (!isAuthorized) return;

        setIsLoadingData(true);
        const usersQuery = query(collection(db, 'users'));
        
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
            setAllUsers(fetchedUsers);
            
            const pendingRequests = fetchedUsers.filter(u => u.hostApplicationStatus === 'pending');
            setVerificationRequests(pendingRequests);
            
            setIsLoadingData(false);
        }, (error) => {
            console.error("Error fetching admin data:", error);
            setIsLoadingData(false);
        });

        return () => unsubscribe();
    }, [isAuthorized]);

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
                        {activeSection === 'users' && <UserManagement allUsers={allUsers} isLoading={isLoadingData} />}
                        {activeSection === 'reports' && <Reports />}
                        {activeSection === 'verifications' && <Verifications verificationRequests={verificationRequests} isLoading={isLoadingData} />}
                    </section>
                </div>
            </main>
        </div>
    )
}
