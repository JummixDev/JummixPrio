
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { PartyPopper, CalendarDays, Users, Wand2, ArrowRight, Twitter, Instagram, Facebook } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';

function SignInForm() {
  const { signIn } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error(error);
      // You can add user-facing error handling here
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
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required {...register('password')} />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const { signUp } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await signUp(data.email, data.password);
    } catch (error) {
      console.error(error);
      // You can add user-facing error handling here
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
            <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
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
                <Card className="w-full max-w-sm mx-auto shadow-2xl">
                    <CardHeader className="text-center">
                    <h1 className="text-2xl font-bold font-headline text-primary">Jummix</h1>
                    <CardTitle className="text-2xl font-headline mt-4">
                        Join the Fun!
                    </CardTitle>
                    <CardDescription>
                        Sign in or create an account to start your Jummix journey.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Tabs defaultValue="signup">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
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

      {/* Footer */}
      <footer className="bg-card border-t">
          <div className="container mx-auto py-8 px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
            <div className="mb-6 sm:mb-0">
                <h1 className="text-xl font-bold font-headline text-primary mb-2">Jummix</h1>
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Jummix Inc. All rights reserved.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex gap-4 text-sm">
                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                    <Link href="/imprint" className="text-muted-foreground hover:text-primary transition-colors">Imprint</Link>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Twitter className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Instagram className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Facebook className="h-5 w-5" /></Button>
                </div>
            </div>
          </div>
      </footer>
    </div>
  );
}
