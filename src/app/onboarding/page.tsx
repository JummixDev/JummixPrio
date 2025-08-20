
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, UserCircle, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

const onboardingSchema = z.object({
    displayName: z.string().min(3, { message: "Display name must be at least 3 characters." }),
    bio: z.string().max(160, { message: "Bio cannot be longer than 160 characters." }).optional(),
    interests: z.string().optional(),
});

type OnboardingInput = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const { user, userData, loading, updateUserProfile, updateUserProfileImage } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            displayName: '',
            bio: '',
            interests: '',
        },
    });

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/');
            } else if (userData?.onboardingComplete) {
                router.push('/dashboard');
            } else if (userData) {
                 form.setValue('displayName', userData.displayName || '');
                 if (userData.photoURL) {
                    setImagePreview(userData.photoURL);
                 }
            }
        }
    }, [user, userData, loading, router, form]);

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
        if (!user) return;

        let finalPhotoURL = userData?.photoURL || imagePreview;

        try {
            // Step 1: Upload image if a new one is selected
            if (imageFile) {
                finalPhotoURL = await updateUserProfileImage(imageFile, 'profile');
            }

            // Step 2: Validate that there is a photo
            if (!finalPhotoURL) {
                toast({
                    variant: 'destructive',
                    title: 'Profile picture is required',
                    description: 'Please upload a profile picture to continue.',
                });
                return;
            }

            // Step 3: Update profile with all data
            await updateUserProfile({
                displayName: data.displayName,
                bio: data.bio,
                interests: data.interests?.split(',').map(i => i.trim()).filter(Boolean) || [],
                photoURL: finalPhotoURL,
                onboardingComplete: true,
            });

            toast({
                title: 'Profile created!',
                description: 'Welcome to Jummix! You will be redirected shortly.',
            });
            // The redirection is handled by the useAuth hook now,
            // once it detects that onboardingComplete is true.
            
        } catch (error) {
            console.error('Onboarding failed:', error);
            toast({
                variant: 'destructive',
                title: 'Onboarding Failed',
                description: 'Could not save your profile. Please try again.',
            });
        }
    };

    if (loading || !user || (userData && userData.onboardingComplete)) {
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
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Profile
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
