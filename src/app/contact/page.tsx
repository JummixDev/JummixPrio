
'use client';

import { Footer } from '@/components/jummix/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: 'Nachricht gesendet!',
            description: 'Vielen Dank für Ihre Anfrage. Wir werden uns so schnell wie möglich bei Ihnen melden.',
        });
        // In einer echten App würden hier die Formulardaten zurückgesetzt
    };

  return (
    <div className="bg-secondary/20 min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-40 pt-16 -mt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Kontakt</h1>
          </div>
      </header>
      <main className="flex-grow flex items-center justify-center container mx-auto p-4 pt-16">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Schreiben Sie uns</CardTitle>
                <CardDescription>Haben Sie Fragen, Anregungen oder Feedback? Wir freuen uns, von Ihnen zu hören.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ihr Name</Label>
                            <Input id="name" placeholder="Max Mustermann" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Ihre E-Mail</Label>
                            <Input id="email" type="email" placeholder="max@example.com" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Betreff</Label>
                        <Input id="subject" placeholder="Worum geht es?" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message">Ihre Nachricht</Label>
                        <Textarea id="message" placeholder="Schreiben Sie hier Ihre Nachricht..." required rows={5} />
                    </div>
                    <Button type="submit" className="w-full">Nachricht senden</Button>
                </form>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
