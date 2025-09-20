
import { Footer } from '@/components/jummix/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Zap, Heart, PartyPopper, Search, UserCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">About Jummix</h1>
          </div>
      </header>
      <main className="flex-grow pt-16 pb-24">
        <section className="relative py-20 sm:py-32 flex items-center justify-center text-center">
            <div className="absolute inset-0 z-0">
                <Image src="https://picsum.photos/seed/jummix-about/1920/1080" alt="People at an event" layout="fill" objectFit="cover" className="opacity-20" data-ai-hint="people community event" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
            </div>
            <div className="relative z-10 space-y-6 container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight text-primary">
                    We bring people together.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Jummix was born from a simple idea: experiences are best when shared. Our mission is to create a platform that makes it easy for everyone to find, create, and share unforgettable moments with the right people.
                </p>
            </div>
        </section>
        
        <section className="container mx-auto py-20 px-4">
            <h2 className="text-3xl font-bold font-headline mb-12 text-center">What drives us</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-4">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">Community</h3>
                    <p className="text-muted-foreground">We believe in the power of communities. Every event is a chance to make new friends and strengthen existing relationships.</p>
                </div>
                 <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mx-auto mb-4">
                        <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">Experiences</h3>
                    <p className="text-muted-foreground">From the big music festival to the small workshop – we celebrate the diversity of experiences that enrich life.</p>
                </div>
                 <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-destructive/10 text-destructive rounded-full mx-auto mb-4">
                       <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">Passion</h3>
                    <p className="text-muted-foreground">Our platform is developed by a team that is passionate about attending and hosting events. We build what we love.</p>
                </div>
            </div>
        </section>
        
        <section className="bg-secondary/50 py-20">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl font-bold font-headline mb-4">So funktioniert's</h2>
                 <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Joining the fun or creating your own event is simple. Here’s how you can get started.</p>
                 <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-left space-y-8">
                        <h3 className="text-2xl font-bold font-headline text-primary">For Attendees</h3>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl">1</div>
                            <div>
                                <h4 className="font-bold">Discover Events</h4>
                                <p className="text-muted-foreground">Browse our diverse range of events or use the AI-powered search to find exactly what you're looking for.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl">2</div>
                            <div>
                                <h4 className="font-bold">Book Your Spot</h4>
                                <p className="text-muted-foreground">Secure your ticket with a few clicks through our secure payment system or RSVP to free events.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl">3</div>
                            <div>
                                <h4 className="font-bold">Enjoy the Moment</h4>
                                <p className="text-muted-foreground">Meet new people, create memories, and have an unforgettable time.</p>
                            </div>
                        </div>
                    </div>
                     <div className="text-left space-y-8">
                        <h3 className="text-2xl font-bold font-headline text-accent">For Hosts</h3>
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-xl">1</div>
                            <div>
                                <h4 className="font-bold">Get Verified</h4>
                                <p className="text-muted-foreground">Apply to become a verified host to ensure a safe and high-quality community for everyone.</p>
                            </div>
                        </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-xl">2</div>
                            <div>
                                <h4 className="font-bold">Create Your Event</h4>
                                <p className="text-muted-foreground">Use our simple tools to list your event, set the price, and manage all the details with ease.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-xl">3</div>
                            <div>
                                <h4 className="font-bold">Bring People Together</h4>
                                <p className="text-muted-foreground">Welcome your guests and create an amazing experience that they'll talk about for years to come.</p>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </section>

        <section className="container mx-auto py-20 px-4 text-center">
            <h2 className="text-3xl font-bold font-headline mb-4">Ready to Jump in?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Your next great experience is just a click away. Or, if you're feeling creative, why not host your own?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                    <Link href="/explore">
                        <Search className="mr-2"/> Explore Events
                    </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                     <Link href="/host/apply-verification">
                        <UserCheck className="mr-2"/> Become a Host
                    </Link>
                </Button>
            </div>
        </section>

      </main>
    </div>
  );
}
