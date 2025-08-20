
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, UserCircle, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FormDescription } from '@/components/ui/form';

const onboardingSchema = z.object({
    displayName: z.string().min(3, { message: "Display name must be at least 3 characters." }),
    bio: z.string().max(160, { message: "Bio cannot be longer than 160 characters." }).optional(),
    interests: z.string().optional(),
});

type OnboardingInput = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const { user, userData, loading, completeOnboarding } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            displayName: '',
            bio: '',
            interests: '',
        },
    });
    
    useEffect(() => {
        if (!loading && userData) {
             form.setValue('displayName', userData.displayName || '');
             form.setValue('bio', userData.bio || '');
             form.setValue('interests', (userData.interests || []).join(', '));
             if (userData.photoURL) {
                setImagePreview(userData.photoURL);
             }
        }
    }, [userData, loading, form]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: OnboardingInput) => {
        if (!imageFile && !userData?.photoURL) {
            toast({
                variant: 'destructive',
                title: 'Profile picture is required',
                description: 'Please upload a profile picture to continue.',
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            await completeOnboarding({
                displayName: data.displayName,
                bio: data.bio || '',
                interests: data.interests?.split(',').map(i => i.trim()).filter(Boolean) || [],
                imageFile: imageFile,
            });

            toast({
                title: 'Profile created!',
                description: 'Welcome to Jummix! Redirecting you to the dashboard...',
            });
            // The redirect will be handled by the useEffect in useAuth
            
        } catch (error: any) {
            console.error('Onboarding failed:', error);
            toast({
                variant: 'destructive',
                title: 'Onboarding Failed',
                description: error.message || 'Could not save your profile. Please try again.',
            });
        } finally {
             setIsSubmitting(false);
        }
    };


    if (loading || !user || !userData) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Loading...</h1>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Welcome to Jummix!</CardTitle>
                    <CardDescription>Let's set up your profile. Complete these steps to start discovering events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32 border-4 border-muted ring-2 ring-ring">
                                    <AvatarImage src={imagePreview || undefined} />
                                    <AvatarFallback>
                                        <UserCircle className="w-full h-full text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Upload Profile Photo
                                </Button>
                            </div>
                            <FormField
                                control={form.control}
                                name="displayName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="How you'll appear to others" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tell us a little about yourself..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="interests"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interests (comma-separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Live Music, Hiking, Tech" {...field} />
                                        </FormControl>
                                        <FormDescription>This helps us recommend events you'll love.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Profile
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
