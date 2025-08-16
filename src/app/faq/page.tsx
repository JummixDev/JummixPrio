
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
        question: "Wie erstelle ich ein Event?",
        answer: "Um ein Event zu erstellen, müssen Sie ein verifizierter Host sein. Wenn Sie das sind, finden Sie in Ihrem Host-Dashboard einen 'Neues Event erstellen'-Button. Füllen Sie einfach das Formular aus und schon ist Ihr Event online!"
    },
    {
        question: "Ist die Nutzung von Jummix kostenlos?",
        answer: "Die grundlegende Nutzung von Jummix als Teilnehmer ist völlig kostenlos. Sie können Events entdecken, Freunde finden und an kostenlosen Veranstaltungen teilnehmen. Für kostenpflichtige Events fällt der jeweilige Ticketpreis an. Für Hosts können je nach Event-Umfang Gebühren anfallen."
    },
    {
        question: "Wie sicher ist die Bezahlung über die Plattform?",
        answer: "Wir arbeiten mit dem zertifizierten Zahlungsdienstleister Stripe zusammen, um höchste Sicherheitsstandards zu gewährleisten. Ihre Zahlungsdaten werden verschlüsselt und sicher verarbeitet und niemals auf unseren Servern gespeichert."
    },
    {
        question: "Wie werde ich ein verifizierter Host?",
        answer: "Jeder Nutzer kann sich als Host bewerben. Klicken Sie dazu einfach auf den entsprechenden Link in Ihren Einstellungen oder versuchen Sie, das Host-Dashboard aufzurufen. Nach Ausfüllen des Antrags wird dieser von unserem Team geprüft. Wir achten auf Vollständigkeit und Seriosität, um die Qualität der Events auf unserer Plattform sicherzustellen."
    },
    {
        question: "Kann ich sehen, welche meiner Freunde an einem Event teilnehmen?",
        answer: "Ja! Auf jeder Event-Detailseite und auf den Event-Karten sehen Sie, welche Ihrer Freunde bereits zugesagt haben. Das macht die gemeinsame Planung noch einfacher."
    }
]

export default function FaqPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Häufig gestellte Fragen (FAQ)</h1>
          </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-headline mb-2 text-center">Haben Sie Fragen?</h2>
            <p className="text-muted-foreground mb-8 text-center">Hier finden Sie Antworten auf die häufigsten Fragen zu Jummix.</p>

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
      <Footer />
    </div>
  );
}
