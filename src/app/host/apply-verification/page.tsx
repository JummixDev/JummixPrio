
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ApplyVerificationPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would submit this data to your backend
        toast({
            title: 'Application Submitted!',
            description: 'Thank you for applying. We will review your application and get back to you soon.',
        });
        // Redirect the user after submission
        setTimeout(() => router.push('/dashboard'), 2000);
    };

    return (
        <div className="bg-secondary/20 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                 <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Become a Verified Host</CardTitle>
                        <CardDescription>
                            Fill out the form below to apply for host privileges. This allows you to create and manage events on Jummix.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" placeholder="e.g., Alex Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brandName">Organization / Brand Name (Optional)</Label>
                                    <Input id="brandName" placeholder="e.g., Awesome Events Inc." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="123 Main St, Anytown, USA" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="motivation">Motivation</Label>
                                <Textarea id="motivation" placeholder="Tell us why you want to be a host and what kind of events you plan to organize." required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="experience">Experience (Optional)</Label>
                                <Textarea id="experience" placeholder="Describe any past experience you have with organizing events. You can include links to past events or social media pages." />
                            </div>
                             <div className="flex items-start space-x-2">
                                <input type="checkbox" id="terms" required className="mt-1"/>
                                <label htmlFor="terms" className="text-sm text-muted-foreground">
                                    I have read and agree to the <Link href="/terms" className="underline">Host Terms of Service</Link> and our <Link href="/privacy" className="underline">Privacy Policy</Link>.
                                </label>
                            </div>
                            <Button type="submit" className="w-full">Submit Application</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    