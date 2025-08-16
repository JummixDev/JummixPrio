
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function EditProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user) {
        // Pre-fill form with user data
        setValue('displayName', user.displayName || user.email?.split('@')[0]);
        // You can add more fields here, like a bio, once you store them
    }
  }, [user, loading, router, setValue]);

  const onSubmit = (data: any) => {
    // Here you would typically update the user's profile in your database
    // For now, we'll just show a success toast
    console.log('Profile updated:', data);
    toast({
      title: 'Profile Updated!',
      description: 'Your changes have been saved successfully.',
    });
    router.push('/dashboard');
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
              <h1 className="text-xl font-bold ml-4">Edit Profile</h1>
          </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Update your public profile details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  {...register('displayName', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={`@${user.email?.split('@')[0] || 'username'}`}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little about yourself"
                  {...register('bio')}
                  defaultValue="Lover of live music, outdoor adventures, and spontaneous weekend trips."
                />
              </div>
              <div className="flex justify-end gap-2">
                  <Button variant="outline" asChild>
                      <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
