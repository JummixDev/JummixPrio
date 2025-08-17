
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function ApplyVerificationPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { updateUserHostApplicationStatus } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await updateUserHostApplicationStatus('pending');
            toast({
                title: 'Bewerbung eingereicht!',
                description: 'Vielen Dank für Ihre Bewerbung. Wir werden sie prüfen und uns bei Ihnen melden.',
            });
            // Redirect the user after submission
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (error) {
            console.error("Error submitting application:", error);
            toast({
                variant: 'destructive',
                title: 'Fehler',
                description: 'Ihre Bewerbung konnte nicht eingereicht werden. Bitte versuchen Sie es erneut.',
            });
        }
    };

    return (
        <div className="bg-secondary/20 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                 <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Zurück zum Dashboard
                    </Link>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Als verifizierter Host bewerben</CardTitle>
                        <CardDescription>
                            Füllen Sie das Formular aus, um Host-Privilegien zu beantragen. Damit können Sie Events auf Jummix erstellen und verwalten.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Vollständiger Name</Label>
                                    <Input id="fullName" placeholder="z.B. Alex Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brandName">Organisation / Markenname (Optional)</Label>
                                    <Input id="brandName" placeholder="z.B. Awesome Events Inc." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input id="address" placeholder="Hauptstr. 123, 10115 Berlin" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="motivation">Motivation</Label>
                                <Textarea id="motivation" placeholder="Sagen Sie uns, warum Sie Host werden möchten und welche Art von Events Sie planen." required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="experience">Erfahrung (Optional)</Label>
                                <Textarea id="experience" placeholder="Beschreiben Sie Ihre bisherige Erfahrung in der Organisation von Events. Sie können Links zu vergangenen Events oder Social-Media-Seiten einfügen." />
                            </div>
                             <div className="flex items-start space-x-2">
                                <input type="checkbox" id="terms" required className="mt-1"/>
                                <label htmlFor="terms" className="text-sm text-muted-foreground">
                                    Ich habe die <Link href="/terms" className="underline">Host-Nutzungsbedingungen</Link> und unsere <Link href="/privacy" className="underline">Datenschutzrichtlinie</Link> gelesen und stimme ihnen zu.
                                </label>
                            </div>
                            <Button type="submit" className="w-full">Bewerbung absenden</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
