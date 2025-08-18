
import { Footer } from '@/components/jummix/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Zap, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Über Jummix</h1>
          </div>
      </header>
      <main className="flex-grow pt-16">
        <section className="relative py-20 sm:py-32 flex items-center justify-center text-center">
            <div className="absolute inset-0 z-0">
                <Image src="https://placehold.co/1920x1080.png" alt="Menschen bei einem Event" layout="fill" objectFit="cover" className="opacity-20" data-ai-hint="people community event" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
            </div>
            <div className="relative z-10 space-y-6 container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight text-primary">
                    Wir bringen Menschen zusammen.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Jummix wurde aus einer einfachen Idee geboren: Erlebnisse sind am schönsten, wenn man sie teilt. Unsere Mission ist es, eine Plattform zu schaffen, die es jedem leicht macht, unvergessliche Momente zu finden, zu erstellen und mit den richtigen Leuten zu teilen.
                </p>
            </div>
        </section>
        
        <section className="container mx-auto py-20 px-4">
            <h2 className="text-3xl font-bold font-headline mb-12 text-center">Was uns antreibt</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">Gemeinschaft</h3>
                    <p className="text-muted-foreground">Wir glauben an die Kraft von Gemeinschaften. Jedes Event ist eine Chance, neue Freunde zu finden und bestehende Beziehungen zu stärken.</p>
                </div>
                 <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mx-auto mb-4">
                        <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">Erlebnisse</h3>
                    <p className="text-muted-foreground">Vom großen Musikfestival bis zum kleinen Workshop – wir feiern die Vielfalt der Erlebnisse, die das Leben bereichern.</p>
                </div>
                 <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 text-destructive rounded-full mx-auto mb-4">
                       <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">Leidenschaft</h3>
                    <p className="text-muted-foreground">Unsere Plattform wird von einem Team entwickelt, das selbst leidenschaftlich gerne Events besucht und veranstaltet. Wir bauen das, was wir selbst lieben.</p>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
