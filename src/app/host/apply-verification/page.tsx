
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
import { useAuth } from '@/hooks/use-auth';

export default function ApplyVerificationPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { updateUserHostApplicationStatus } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Basic form validation for the new checkbox
        const form = e.currentTarget;
        const ageCheckbox = form.elements.namedItem('age') as HTMLInputElement;
        if (!ageCheckbox.checked) {
            toast({
                variant: 'destructive',
                title: 'Confirmation required',
                description: 'You must confirm that you are at least 18 years old.',
            });
            return;
        }

        try {
            await updateUserHostApplicationStatus('pending');
            toast({
                title: 'Application submitted!',
                description: 'Thank you for your application. We will review it and get back to you.',
            });
            // Redirect the user after submission
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error) {
            console.error("Error submitting application:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Your application could not be submitted. Please try again.',
            });
        }
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
                        <CardTitle className="font-headline text-2xl">Apply as a Verified Host</CardTitle>
                        <CardDescription>
                            Fill out the form to apply for host privileges. This will allow you to create and manage events on Jummix.
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
                                <Input id="address" placeholder="123 Main St, 10115 Berlin" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="motivation">Motivation</Label>
                                <Textarea id="motivation" placeholder="Tell us why you want to become a host and what kind of events you are planning." required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="experience">Experience (Optional)</Label>
                                <Textarea id="experience" placeholder="Describe your previous experience in organizing events. You can include links to past events or social media pages." />
                            </div>
                             <div className="flex items-start space-x-2">
                                <input type="checkbox" id="age" name="age" required className="mt-1"/>
                                <label htmlFor="age" className="text-sm text-muted-foreground">
                                   I confirm that I am at least 18 years old.
                                </label>
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
