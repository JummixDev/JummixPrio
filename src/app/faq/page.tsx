
import { Footer } from '@/components/jummix/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
    {
        question: "How do I create an event?",
        answer: "To create an event, you must be a verified host. If you are, you will find a 'Create New Event' button on your host dashboard. Simply fill out the form and your event will be online!"
    },
    {
        question: "Is using Jummix free?",
        answer: "The basic use of Jummix as a participant is completely free. You can discover events, find friends, and attend free events. For paid events, the respective ticket price applies. For hosts, fees may apply depending on the scope of the event."
    },
    {
        question: "How secure is payment via the platform?",
        answer: "We work with the certified payment service provider Stripe to ensure the highest security standards. Your payment data is encrypted and processed securely and never stored on our servers."
    },
    {
        question: "How do I become a verified host?",
        answer: "Any user can apply to become a host. To do this, simply click on the corresponding link in your settings or try to access the host dashboard. After completing the application, it will be reviewed by our team. We pay attention to completeness and seriousness to ensure the quality of events on our platform."
    },
    {
        question: "Can I see which of my friends are attending an event?",
        answer: "Yes! On every event detail page and on the event cards, you can see which of your friends have already confirmed their attendance. This makes planning together even easier."
    }
]

export default function FaqPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Frequently Asked Questions (FAQ)</h1>
          </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 pt-16 pb-24">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-headline mb-2 text-center">Do you have questions?</h2>
            <p className="text-muted-foreground mb-8 text-center">Here you will find answers to the most common questions about Jummix.</p>

            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                     <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-semibold text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                         {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </main>
    </div>
  );
}
