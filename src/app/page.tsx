
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { PartyPopper, CalendarDays, Users, Wand2, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from 'firebase/app';
import { Footer } from '@/components/jummix/Footer';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.486-11.187-8.166l-6.571,4.819C9.22,39.638,15.989,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.545,44,29.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.01,16.23c-1.2,0-2.31-0.52-3.04-1.55c-1.2-1.68-1.5-3.83-0.84-5.73c0.61-1.73,2.07-2.88,3.75-2.95 c1.18-0.05,2.33,0.47,3.13,1.48c-0.02-0.01-1.89,1.25-1.9,2.9c-0.01,1.83,2.2,2.6,2.2,2.6c-1.3,2.2-3.44,2.25-4.3,2.25 M14.3,3.32C13.25,2.16,11.75,2,10.5,2C8.35,2,6.53,3.48,5.49,5.65c-1.8,3.66-0.84,7.4,1.43,9.58c0.97,0.92,2.02,1.46,3.22,1.46 c0.2,0,0.4-0.02,0.59-0.05c1.4-0.19,2.62-0.95,3.52-1.95c1.07-1.18,1.75-2.73,1.72-4.36c-0.04-2.5-1.62-3.89-3.57-3.99 C12.33,6.34,12.33,6.34,14.3,3.32L14.3,3.32z" />
    </svg>
);

function AuthForm() {
  const [activeTab, setActiveTab] = useState('signin');
  const { register: registerSignIn, handleSubmit: handleSignIn, setValue: setSignInValue, formState: { isSubmitting: isSigningIn } } = useForm();
  const { register: registerSignUp, handleSubmit: handleSignUp, getValues: getSignUpValues, formState: { isSubmitting: isSigningUp } } = useForm();
  const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const onSignInSubmit = async (data: any) => {
    try {
      const userCredential = await signIn(data.email, data.password);
      // After successful sign in, check onboarding status and redirect
      if (userCredential.userData?.onboardingComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } catch (error) {
      // Handle sign in errors
      console.error(error);
      toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
      });
    }
  };

  const onSignUpSubmit = async (data: any) => {
    try {
      await signUp(data.email, data.password);
      // After sign up, always redirect to onboarding
      router.push('/onboarding');
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        toast({
          variant: "destructive",
          title: "Sign-up failed.",
          description: "This email is already in use. Please sign in instead.",
        });
        setActiveTab('signin');
        setSignInValue('email', getSignUpValues('email'));
      } else {
        console.error(error);
        toast({
            variant: "destructive",
            title: "An error occurred.",
            description: "Something went wrong. Please try again later.",
        });
      }
    }
  };
  
  const handleSocialAuth = async (authProvider: 'google' | 'apple') => {
      try {
          const socialSignIn = authProvider === 'google' ? signInWithGoogle : signInWithApple;
          const result = await socialSignIn();
          if (result.userData?.onboardingComplete) {
              router.push('/dashboard');
          } else {
              router.push('/onboarding');
          }
      } catch (error) {
          console.error(`${authProvider} sign in error:`, error);
           toast({
              variant: "destructive",
              title: "Authentication Failed",
              description: `Could not sign in with ${authProvider}. Please try again.`,
          });
      }
  }


  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl">
      <CardHeader className="text-center">
        <Link href="/">
          <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
        </Link>
        <CardTitle className="text-2xl font-headline mt-4">
          Join the Fun!
        </CardTitle>
        <CardDescription>
          Sign in or create an account to start your Jummix journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn(onSignInSubmit)} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="alex@example.com" required {...registerSignIn('email')} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/reset-password" prefetch={false} className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required {...registerSignIn('password')} />
              </div>
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
               <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" onClick={() => handleSocialAuth('google')}><GoogleIcon className="mr-2 h-5 w-5"/> Google</Button>
                  <Button variant="outline" type="button" onClick={() => handleSocialAuth('apple')}><AppleIcon className="mr-2 h-5 w-5 fill-black dark:fill-white"/> Apple</Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp(onSignUpSubmit)} className="p-4 space-y-4">
               <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="alex@example.com" required {...registerSignUp('email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" required {...registerSignUp('password')} />
              </div>
              <Button type="submit" className="w-full" disabled={isSigningUp}>
                 {isSigningUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
               <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <Button variant="outline" type="button" onClick={() => handleSocialAuth('google')}><GoogleIcon className="mr-2 h-5 w-5"/> Google</Button>
                  <Button variant="outline" type="button" onClick={() => handleSocialAuth('apple')}><AppleIcon className="mr-2 h-5 w-5 fill-black dark:fill-white"/> Apple</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}


function LandingPageContent() {
  const signupCardRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  // This effect will run ONCE after the initial render,
  // and redirect a logged-in user to their dashboard.
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  const scrollToSignup = () => {
    signupCardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
    // Show a loading indicator while auth state is being determined
  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold font-headline text-primary">Loading your Jummix experience</h1>
        </div>
    );
  }

  // If the user is already logged in, show a redirecting message or nothing
  // to avoid flashing the landing page.
  if (user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold font-headline text-primary">Redirecting to your dashboard...</h1>
        </div>
    );
  }


  return (
    <div className="bg-background text-foreground font-body">
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
          </Link>
          <Button onClick={scrollToSignup}>Sign In</Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-center p-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image src="https://placehold.co/1920x1080.png" alt="Social event collage" layout="fill" objectFit="cover" className="opacity-20" data-ai-hint="concert crowd party" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
            </div>

            <div className="relative z-10 space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight">
                Discover & Share <br/> Unforgettable Experiences
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Jummix is your ultimate social event hub. Find exciting events, connect with friends, and get personalized recommendations powered by AI. Your next great memory is just a click away.
                </p>
                <Button size="lg" onClick={scrollToSignup}>
                Get Started for Free <ArrowRight className="ml-2"/>
                </Button>
            </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-20 px-4 text-center">
            <h2 className="text-4xl font-bold font-headline mb-4">Why You'll Love Jummix</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
                We're more than just an event calendar. We're a community builder, a memory maker, and your personal guide to what's happening.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card p-8 rounded-lg shadow-sm border">
                    <CalendarDays className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-headline mb-2">Find Your Vibe</h3>
                    <p className="text-muted-foreground">Explore a curated list of events, from concerts and festivals to local meetups and workshops.</p>
                </div>
                <div className="bg-card p-8 rounded-lg shadow-sm border">
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-headline mb-2">Connect with Your Crew</h3>
                    <p className="text-muted-foreground">See who's going where, make plans with friends, and share your favorite moments in your activity feed.</p>
                </div>
                <div className="bg-card p-8 rounded-lg shadow-sm border">
                    <Wand2 className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold font-headline mb-2">AI-Powered Discovery</h3>
                    <p className="text-muted-foreground">Our smart recommender learns what you like and suggests new events tailored just for you.</p>
                </div>
            </div>
        </section>

        {/* Sign-up Section */}
        <section className="bg-secondary/40 py-20">
            <div ref={signupCardRef}>
                <AuthForm />
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


export default function LandingPage() {
    return <LandingPageContent />;
}
