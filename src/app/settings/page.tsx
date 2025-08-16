
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Shield, Bell, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
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


function ProfileSettings() {
  const { user, loading, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (user) {
      setValue('displayName', user.displayName || user.email?.split('@')[0]);
      setValue('bio', 'Lover of live music, outdoor adventures, and spontaneous weekend trips.'); // This would come from your DB
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await updateUserProfile({ displayName: data.displayName });
      // Here you would also update other data in Firestore, e.g. the bio
      toast({
        title: 'Profile Updated!',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: 'Update Failed',
        description: 'Could not save your profile changes. Please try again.',
      });
    }
  };

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Profile</CardTitle>
        <CardDescription>Update your public profile details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" placeholder="Your name" {...register('displayName', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={`@${user.email?.split('@')[0] || 'username'}`} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us a little about yourself" {...register('bio')} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PrivacySettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Manage who can see your activity and profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">Privacy settings will be available here soon.</p>
            </CardContent>
        </Card>
    )
}

function NotificationSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p className="text-muted-foreground">Notification settings will be available here soon.</p>
            </CardContent>
        </Card>
    )
}

function AccountSettings() {
  const { user } = useAuth();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled />
        </div>
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><Trash2/> Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="mb-4">Once you delete your account, there is no going back. Please be certain.</CardDescription>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Yes, delete account</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}


export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: Trash2 },
  ]

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-bold ml-4">Settings</h1>
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
            <section className="md:col-span-3">
                {activeSection === 'profile' && <ProfileSettings />}
                {activeSection === 'privacy' && <PrivacySettings />}
                {activeSection === 'notifications' && <NotificationSettings />}
                {activeSection === 'account' && <AccountSettings />}
            </section>
        </div>
      </main>
    </div>
  );
}
