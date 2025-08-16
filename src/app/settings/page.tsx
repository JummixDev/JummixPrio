
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Shield, Bell, Trash2, Image as ImageIcon, CheckCircle, Mail, Loader2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function ProfileSettings() {
  const { user, loading, updateUserProfile, userData } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { isSubmitting, isDirty } } = useForm();
  
  useEffect(() => {
    if (userData) {
      setValue('displayName', userData.displayName || user?.email?.split('@')[0]);
      setValue('bio', userData.bio || 'Lover of live music, outdoor adventures, and spontaneous weekend trips.');
    }
  }, [userData, user, setValue]);

  const onSubmit = async (data: any) => {
    if (!user) return;
    try {
      await updateUserProfile({
        displayName: data.displayName,
        bio: data.bio
      });

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

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
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
            <Input id="username" value={`@${userData?.username || 'username'}`} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us a little about yourself" {...register('bio')} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PhotoSettings() {
    const { userData, updateUserProfileImage } = useAuth();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState<'profile' | 'banner' | null>(null);

    const profileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(type);
        try {
            await updateUserProfileImage(file, type);
            toast({
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} Image Updated`,
                description: "Your new image has been saved."
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'Could not upload your image. Please try again.'
            });
        } finally {
            setIsUploading(null);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Photos</CardTitle>
                <CardDescription>Manage your profile picture and banner image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4 mt-2">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={userData?.photoURL} alt="Profile picture" />
                            <AvatarFallback>
                                <ImageIcon className="w-10 h-10 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <input
                            type="file"
                            ref={profileInputRef}
                            onChange={(e) => handleFileChange(e, 'profile')}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                        <Button variant="outline" onClick={() => profileInputRef.current?.click()} disabled={isUploading === 'profile'}>
                            {isUploading === 'profile' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Upload New
                        </Button>
                    </div>
                </div>
                 <div>
                    <Label>Banner Image</Label>
                    <div className="flex items-end gap-4 mt-2">
                        <div className="w-48 h-24 bg-muted rounded-md relative overflow-hidden">
                            {userData?.bannerURL ? (
                                <Image src={userData.bannerURL} alt="Banner image" layout="fill" objectFit="cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={bannerInputRef}
                            onChange={(e) => handleFileChange(e, 'banner')}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                        <Button variant="outline" onClick={() => bannerInputRef.current?.click()} disabled={isUploading === 'banner'}>
                           {isUploading === 'banner' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                           Upload New
                        </Button>
                    </div>
                </div>
                <Separator />
                 <div>
                    <h3 className="font-semibold mb-2">Photo Gallery</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage photos displayed on your profile's gallery tab.</p>
                    <Button onClick={() => alert("Gallery management coming soon!")}><ImageIcon className="mr-2" /> Manage Gallery</Button>
                </div>
            </CardContent>
        </Card>
    )
}

function PrivacySettings() {
    const [isProfilePublic, setIsProfilePublic] = useState(true);
    const [showOnlineStatus, setShowOnlineStatus] = useState(true);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Privacy & Visibility</CardTitle>
                <CardDescription>Manage who can see your activity and profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="online-status-switch">Profile is Public</Label>
                        <p className="text-sm text-muted-foreground">Allow anyone on the internet to see your profile.</p>
                    </div>
                     <Switch id="online-status-switch" checked={isProfilePublic} onCheckedChange={setIsProfilePublic} />
                </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor='online-status-switch'>Online Status</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see when you're online.</p>
                    </div>
                    <Switch id="online-status-switch" checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
                </div>
            </CardContent>
        </Card>
    )
}

function NotificationSettings() {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState({
        friendRequest: { email: false, push: true },
        eventReminders: { email: true, push: true },
        newMessages: { email: false, push: true },
    });
    const [globalPushEnabled, setGlobalPushEnabled] = useState(false);

    useEffect(() => {
        // Check current permission status on component mount
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                setGlobalPushEnabled(true);
            }
        }
    }, []);

    const handleToggle = (
        category: keyof typeof notifications, 
        type: 'email' | 'push'
    ) => {
        setNotifications(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [type]: !prev[category][type],
            }
        }));
    };

    const handleGlobalPushToggle = async (checked: boolean) => {
        if (!("Notification" in window)) {
            toast({ variant: "destructive", title: "Unsupported Browser", description: "This browser does not support push notifications." });
            return;
        }

        if (checked) {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                setGlobalPushEnabled(true);
                toast({ title: "Push Notifications Enabled", description: "You will now receive push notifications." });
            } else {
                setGlobalPushEnabled(false);
                toast({ variant: "destructive", title: "Push Notifications Denied", description: "You have blocked push notifications. You may need to change this in your browser settings." });
            }
        } else {
            setGlobalPushEnabled(false);
            toast({ title: "Push Notifications Disabled", description: "You will no longer receive push notifications." });
        }
    };


    const notificationItems = [
        { id: 'friendRequest', title: 'New Friend Request', description: 'When someone sends you a friend request.' },
        { id: 'eventReminders', title: 'Event Reminders', description: 'For events you have RSVP\'d to.' },
        { id: 'newMessages', title: 'New Messages', description: 'When you receive a new chat message.' },
    ] as const;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose how and when you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/50">
                    <div>
                        <Label htmlFor="global-push-switch" className="text-base">Enable Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications on this device.</p>
                    </div>
                     <Switch id="global-push-switch" checked={globalPushEnabled} onCheckedChange={handleGlobalPushToggle} />
                </div>
                <div className={cn("divide-y transition-opacity", !globalPushEnabled && "opacity-50 pointer-events-none")}>
                    {notificationItems.map(item => (
                         <div key={item.id} className="py-4 flex items-start justify-between">
                            <div>
                                <Label>{item.title}</Label>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2" title="Email Notifications">
                                    <Mail className="w-4 h-4" />
                                    <Switch 
                                        checked={notifications[item.id].email} 
                                        onCheckedChange={() => handleToggle(item.id, 'email')}
                                    />
                                </div>
                                <div className="flex items-center gap-2" title="Push Notifications">
                                    <Bell className="w-4 h-4" />
                                    <Switch 
                                        checked={notifications[item.id].push} 
                                        onCheckedChange={() => handleToggle(item.id, 'push')}
                                        disabled={!globalPushEnabled}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function AccountSettings() {
  const { user, sendPasswordReset } = useAuth();
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");

  const handleEmailChange = () => {
      // In a real app, you'd call a function to update the email in Firebase Auth,
      // which would send a verification link.
      toast({
          title: "Confirmation Required",
          description: `A confirmation link has been sent to ${emailForVerification}. (This is a simulation)`
      })
      setIsConfirming(true);
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
        await sendPasswordReset(user.email);
        toast({
            title: "Password Reset Email Sent",
            description: "Check your inbox for a link to reset your password.",
        });
    } catch(error) {
        toast({
            variant: "destructive",
            title: "Failed to send email",
            description: "Could not send password reset email. Please try again later.",
        });
    }
  }

  const handleDeleteAccount = () => {
    // In a real app, this would trigger a multi-step process
    // to delete user data from all services (Auth, Firestore, Storage)
    toast({
        title: "Account Deletion Initiated",
        description: "Your account is scheduled for deletion. (This is a simulation)",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your email, password, and account status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
                <Input id="email" type="email" defaultValue={user?.email || ''} onChange={(e) => setEmailForVerification(e.target.value)} />
                <Button onClick={handleEmailChange}>Change</Button>
            </div>
            {isConfirming && (
                <p className="text-sm text-muted-foreground p-2 bg-secondary/50 rounded-md flex items-center gap-2 mt-2">
                    <CheckCircle className="text-primary w-5 h-5"/> Awaiting confirmation for {emailForVerification}
                </p>
            )}
        </div>
        <div className="space-y-2">
            <Label>Password</Label>
            <Button variant="outline" onClick={handlePasswordReset}>Change Password</Button>
            <p className="text-sm text-muted-foreground">You will be sent an email to reset your password.</p>
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
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">Yes, delete account</AlertDialogAction>
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
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'photos', label: 'Photos', icon: ImageIcon },
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
            <section className="md:col-span-3 space-y-6">
                {activeSection === 'profile' && <ProfileSettings />}
                {activeSection === 'photos' && <PhotoSettings />}
                {activeSection === 'privacy' && <PrivacySettings />}
                {activeSection === 'notifications' && <NotificationSettings />}
                {activeSection === 'account' && <AccountSettings />}
            </section>
        </div>
      </main>
    </div>
  );
}
