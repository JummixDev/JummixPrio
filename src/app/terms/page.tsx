
import { Footer } from '@/components/jummix/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-stone dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="text-sm text-muted-foreground">Zuletzt aktualisiert: 29. Juni 2025</p>

        <p>
          <em>Bitte beachten Sie, dass dies ein Mustertext ist und keine rechtsverbindlichen AGB darstellt. Für rechtssichere Geschäftsbedingungen sollten Sie einen Anwalt konsultieren.</em>
        </p>

        <h2 id="geltungsbereich">1. Geltungsbereich und Anbieter</h2>
        <p>Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Event-Plattform "Jummix" (nachfolgend "Plattform"), betrieben von Jummix Events (Musterfirma). Mit der Registrierung und Nutzung unserer Dienste stimmen Sie diesen Bedingungen in ihrer jeweils gültigen Fassung zu.</p>

        <h2 id="leistungen">2. Leistungen von Jummix</h2>
        <p>Jummix stellt eine Online-Plattform zur Verfügung, auf der Nutzer Events entdecken, sich mit anderen vernetzen und daran teilnehmen können. Verifizierte Nutzer ("Hosts") können zudem eigene Events erstellen und verwalten. Jummix ist dabei, sofern nicht explizit anders ausgewiesen, lediglich der Vermittler der auf der Plattform angebotenen Events und nicht der Veranstalter. Der Vertrag über die Teilnahme an einem Event kommt ausschließlich zwischen dem Teilnehmer und dem jeweiligen Host zustande.</p>

        <h2 id="nutzerkonto">3. Nutzerkonto und Pflichten der Nutzer</h2>
        <p>Die Registrierung erfordert die Angabe korrekter und vollständiger Informationen. Sie sind für die Sicherheit Ihres Passworts und alle Aktivitäten, die über Ihr Konto stattfinden, selbst verantwortlich. Sie verpflichten sich, bei der Nutzung von Jummix geltendes Recht zu achten und keine Inhalte zu veröffentlichen, die rechtswidrig, beleidigend, irreführend, pornografisch sind oder die Rechte Dritter verletzen. Jummix übernimmt keine Haftung für die Identität oder Seriosität seiner Nutzer. Nutzer sind selbst dafür verantwortlich, die Authentizität von Profilen und Angaben zu prüfen.</p>

        <h2 id="hosts">4. Besondere Pflichten für Veranstalter (Hosts)</h2>
        <p>Als Host sind Sie für die korrekte, vollständige und wahrheitsgemäße Beschreibung Ihres Events verantwortlich. Sie gewährleisten, dass Sie über alle notwendigen Lizenzen, Genehmigungen und Versicherungen für die Durchführung des Events verfügen. Sie sind alleiniger Vertragspartner der Teilnehmer für das von Ihnen angebotene Event und für die Erfüllung aller damit verbundenen Pflichten (Durchführung, Sicherheit, eventuelle Rückerstattungen) verantwortlich. Hosts müssen volljährig (mind. 18 Jahre) sein. Jummix haftet nicht für den Ausfall, Mängel oder Schäden, die im Rahmen von Events entstehen. Hosts sind zudem für die Versteuerung ihrer Einnahmen selbst verantwortlich.</p>

        <h2 id="zahlung">5. Zahlungsabwicklung und Gebühren</h2>
        <p>Die Abwicklung von Zahlungen für kostenpflichtige Events erfolgt über unseren externen Zahlungsdienstleister Stripe unter Nutzung von Stripe Connect. Jummix ist nicht Teil des Zahlungsflusses zwischen Teilnehmer und Host, sondern leitet die Zahlung lediglich technisch weiter. Für die Vermittlung und Nutzung der Plattform erheben wir eine Servicegebühr, die direkt vom Ticketpreis einbehalten wird.</p>
        <p><strong>Beispiel (Split Payment):</strong> Ein Teilnehmer zahlt 50 €. Davon gehen beispielsweise 10 € (20 % Servicegebühr) an Jummix und 40 € werden direkt an den Stripe-Account des Hosts transferiert. Die genaue Gebührenhöhe wird Ihnen beim Erstellen eines kostenpflichtigen Events und im Checkout-Prozess transparent ausgewiesen. Es gelten die AGB und Datenschutzbestimmungen von Stripe.</p>

        <h2 id="haftung">6. Haftung und Inhalte</h2>
        <p>Jummix haftet nicht für die Durchführung, Qualität, Sicherheit oder den eventuellen Ausfall der auf der Plattform angebotenen Events. Jegliche Ansprüche, die aus der Teilnahme oder Durchführung eines Events resultieren, sind direkt an den jeweiligen Host zu richten. Die von Nutzern und Hosts erstellten Inhalte (z.B. Eventbeschreibungen, Kommentare) sind fremde Inhalte, für die Jummix keine Verantwortung übernimmt. Wir behalten uns vor, Inhalte zu entfernen, die gegen unsere Richtlinien verstoßen. Wir bieten eine Meldefunktion, können jedoch keine lückenlose Überwachung gewährleisten. Die Plattform wird ohne Gewähr für ständige technische Verfügbarkeit bereitgestellt.</p>

        <h2 id="aenderungen">7. Änderungen der AGB</h2>
        <p>Wir behalten uns das Recht vor, diese AGB jederzeit anzupassen, um sie an veränderte rechtliche oder technische Rahmenbedingungen anzupassen. Über wesentliche Änderungen werden wir Sie rechtzeitig per E-Mail oder durch einen Hinweis auf der Plattform informieren. Ihre fortgesetzte Nutzung der Plattform nach Inkrafttreten der Änderungen gilt als Zustimmung.</p>
      </main>
      <Footer />
    </div>
  );
}
