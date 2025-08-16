
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
import { PartyPopper, CalendarDays, Users, Wand2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from 'firebase/app';
import { Footer } from '@/components/jummix/Footer';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.42 9.88V15.5H7.9v-3.5h2.52V9.6c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.97h-1.5c-1.22 0-1.6.73-1.6 1.52v1.88h3.33l-.53 3.5h-2.8V21.88A10.014 10.014 0 0 0 22 12z"/>
    </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 20.94c1.5 0 2.75-.81 3.5-2.06 1.18-1.85.53-4.52-1.2-5.59-1.59-.97-3.47-.9-4.59.35-1.18 1.27-1.74 3.12-.82 4.67 1.14 1.91 2.94 2.63 4.11 2.63zM12.56 5.59C11.31 4.2 9.69 3.5 8.16 3.5c-2.43 0-4.66 1.48-5.8 3.59-1.56 2.8-1.03 6.2.34 8.04 1.13 1.52 2.66 2.44 4.16 2.44 1.4 0 2.59-.72 3.42-1.85.83-1.13 1.2-2.58.94-3.99-.24-1.28-1-2.04-2.02-2.5-1.07-.48-2.28-.48-3.32.13-.25.14-.54.1-.74-.15-.2-.25-.16-.6.08-.84.93-1 2.23-1.58 3.58-1.58.91 0 1.78.27 2.5.76.54.37 1.2.33 1.66-.08s.55-1.1.18-1.66z"/>
    </svg>
);


function SignInForm() {
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    toast({
                        variant: "destructive",
                        title: "Login Failed",
                        description: "Invalid email or password. Please try again.",
                    });
                    break;
                default:
                    toast({
                        variant: "destructive",
                        title: "An error occurred.",
                        description: "Something went wrong. Please try again later.",
                    });
            }
        }
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="alex@example.com"
            required
            {...register('email')}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/reset-password" prefetch={false} className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" required {...register('password')} />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" onClick={signInWithGoogle}><GoogleIcon className="mr-2 h-4 w-4"/> Google</Button>
            <Button variant="outline" type="button" onClick={signInWithApple}><AppleIcon className="mr-2 h-4 w-4"/> Apple</Button>
        </div>
      </div>
    </form>
  );
}

function SignUpForm() {
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const { register, handleSubmit } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      await signUp(data.email, data.password);
    } catch (error) {
        if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
            toast({
                variant: "destructive",
                title: "Sign-up failed.",
                description: "This email is already in use. Please sign in instead.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "An error occurred.",
                description: "Something went wrong. Please try again later.",
            });
        }
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="alex@example.com"
            required
            {...register('email')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            required
            {...register('password')}
          />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" onClick={signInWithGoogle}><GoogleIcon className="mr-2 h-4 w-4"/> Google</Button>
            <Button variant="outline" type="button" onClick={signInWithApple}><AppleIcon className="mr-2 h-4 w-4"/> Apple</Button>
        </div>
      </div>
    </form>
  );
}


export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const signupCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading || user) {
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>;
  }

  const scrollToSignup = () => {
    signupCardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


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
        <section className="bg-secondary py-20">
            <div className="container mx-auto" ref={signupCardRef}>
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
                    <Tabs defaultValue="signin">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="signin">
                            <CardContent className="p-4">
                                <SignInForm />
                            </CardContent>
                        </TabsContent>
                        <TabsContent value="signup">
                            <CardContent className="p-4">
                                <SignUpForm />
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

    
