
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    setMessage('');
    setError('');
    try {
      await sendPasswordReset(data.email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to get back into your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
              <Button variant="link" className="w-full" asChild>
                <Link href="/">Back to Sign In</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
