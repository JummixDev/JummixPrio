
import { Footer } from '@/components/jummix/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-stone dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Datenschutzerklärung</h1>

        <p>
          <em>Dies ist ein Mustertext und stellt keine rechtsverbindliche Datenschutzerklärung dar. Für eine rechtssichere Erklärung sollten Sie einen Anwalt oder Datenschutzbeauftragten konsultieren.</em>
        </p>

        <h2 id="verantwortlicher">1. Verantwortlicher</h2>
        <p>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
          <br />
          Jummix Events (Musterfirma)
          <br />
          Musterstraße 1
          <br />
          12345 Musterstadt
          <br />
          E-Mail: privacy@jummix.com
        </p>

        <h2 id="daten">2. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>Wir erheben und verarbeiten personenbezogene Daten, um unsere Dienste bereitzustellen, zu verbessern und zu sichern. Dazu gehören:</p>
        <ul>
          <li><strong>Kontoinformationen:</strong> Bei der Registrierung erheben wir Ihren Namen, Ihre E-Mail-Adresse und Ihr Passwort. Freiwillige Angaben wie Profilbild, Biografie, Interessen, Standort und Geburtsdatum werden ebenfalls gespeichert.</li>
          <li><strong>Nutzungsdaten:</strong> Informationen über Ihre Interaktionen mit der Plattform (z.B. besuchte Events, Likes, gespeicherte Events, erstellte Inhalte).</li>
          <li><strong>Zahlungsdaten:</strong> Bei kostenpflichtigen Events werden Ihre Zahlungsdaten sicher von unserem Partner Stripe verarbeitet. Wir speichern keine vollständigen Kreditkartennummern.</li>
          <li><strong>Technische Daten:</strong> IP-Adresse, Browsertyp, Betriebssystem und Geräteinformationen.</li>
          <li><strong>Kommunikationsdaten:</strong> Inhalte Ihrer Nachrichten in Chats und Kommunikation mit unserem Support.</li>
        </ul>

        <h2 id="zweck">3. Zweck und Rechtsgrundlage der Datenverarbeitung</h2>
        <p>Die Verarbeitung Ihrer Daten erfolgt auf Basis der DSGVO:</p>
        <ul>
          <li><strong>Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO):</strong> Zur Bereitstellung der Kernfunktionen von Jummix.</li>
          <li><strong>Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO):</strong> Zur Verbesserung unserer Dienste, zur Betrugsprävention und für personalisierte Empfehlungen.</li>
          <li><strong>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO):</strong> Für optionale Funktionen wie Cookies für Analysezwecke.</li>
        </ul>

        <h2 id="cookies">4. Cookies</h2>
        <p>Unsere Webseite verwendet Cookies. Dies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Wir verwenden technisch notwendige Cookies, um die grundlegende Funktionalität der Seite sicherzustellen. Für alle weiteren Cookies (z.B. für Analyse- oder Marketingzwecke) holen wir über einen Cookie-Banner Ihre ausdrückliche Einwilligung ein. Sie können Ihre Einwilligung jederzeit widerrufen.</p>

        <h2 id="rechte">5. Ihre Rechte als betroffene Person</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie das Recht auf Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten. Sie können viele dieser Einstellungen direkt in Ihrem Profil vornehmen oder uns unter der oben genannten E-Mail-Adresse kontaktieren. Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.</p>
      </main>
      <Footer />
    </div>
  );
}
