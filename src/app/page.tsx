
'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useAuth} from '@/hooks/use-auth';
import {PartyPopper} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';

function SignInForm() {
  const {signIn} = useAuth();
  const {register, handleSubmit} = useForm();

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
  const {signUp} = useAuth();
  const {register, handleSubmit, watch} = useForm();

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

export default function LoginPage() {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading || user) {
    // You can show a loading spinner here
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <PartyPopper className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-headline mt-4">
            Welcome to Jummix
          </CardTitle>
          <CardDescription>
            Your social event hub. Sign in or create an account to continue.
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
  );
}
