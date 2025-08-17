
import { Footer } from '@/components/jummix/Footer';
import Link from 'next/link';

export default function ImprintPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-stone dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Impressum (Imprint)</h1>
        
        <p>
          <em>Dies ist ein Muster-Impressum und dient nur zu Demonstrationszwecken. Es stellt keine Rechtsberatung dar.</em>
        </p>

        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Jummix Events (Musterfirma)<br />
          Musterstraße 1<br />
          12345 Musterstadt
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: service@jummix.com
        </p>

        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Max Mustermann<br />
          Musterstraße 1<br />
          12345 Musterstadt
        </p>

        <h2 id="haftungsausschluss">Haftungsausschluss (Disclaimer)</h2>

        <h3>Allgemeiner Haftungsausschluss</h3>
        <p><strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
        <p><strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
        <p><strong>Haftung für Nutzerinhalte:</strong> Inhalte, die von Dritten (z.B. Nutzern, Veranstaltenden oder Hosts) eingestellt werden, machen wir uns nicht zu eigen. Für die Rechtmäßigkeit, Richtigkeit und Vollständigkeit solcher Inhalte sind ausschließlich die jeweiligen Nutzer verantwortlich. Bei Bekanntwerden von rechtswidrigen oder problematischen Inhalten werden wir diese umgehend entfernen.</p>
        <p><strong>Technische Verfügbarkeit:</strong> Wir bemühen uns, die Webseite stets ohne Unterbrechung verfügbar zu halten. Dennoch kann keine Haftung für die ständige Verfügbarkeit oder für technisch bedingte Verzögerungen, Unterbrechungen oder Ausfälle übernommen werden. Ebenso haften wir nicht für Schäden, die durch die Nutzung oder Nichtnutzung der angebotenen Informationen bzw. durch fehlerhafte oder unvollständige Informationen verursacht wurden.</p>
        <p><strong>Keine Beratung:</strong> Die Inhalte dieser Website stellen keine verbindliche Beratung dar und ersetzen keine individuelle Rechts-, Steuer-, medizinische oder sonstige Fachberatung. Sie dienen ausschließlich der allgemeinen Information. Für Handlungen, die auf Basis dieser Inhalte erfolgen, übernehmen wir keine Haftung.</p>
        <p><strong>Änderungsvorbehalt:</strong> Wir behalten uns ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen oder die Veröffentlichung zeitweise oder endgültig einzustellen.</p>
        <p><strong>Rechtswirksamkeit dieses Haftungsausschlusses:</strong> Dieser Haftungsausschluss ist als Teil des Internetangebots zu betrachten. Sofern einzelne Formulierungen oder Teile dieses Textes der geltenden Rechtslage nicht, nicht mehr oder nicht vollständig entsprechen sollten, bleiben die übrigen Teile des Dokuments in ihrem Inhalt und ihrer Gültigkeit davon unberührt.</p>

        <h3>Zusätzlicher Haftungsausschluss für Veranstalter (Hosts)</h3>
        <ol>
          <li><strong>Rolle von Jummix:</strong> Jummix ist eine Vermittlungsplattform, die Nutzer und Veranstalter (Hosts) zusammenbringt. Wir sind nicht der Organisator, Durchführer oder Verantwortliche der auf der Plattform angebotenen Events. Der Vertrag über die Teilnahme an einem Event kommt ausschließlich zwischen dem Teilnehmer und dem Host zustande.</li>
          <li><strong>Verantwortung und Haftung des Hosts:</strong>
            <ul>
              <li><strong>Event-Durchführung:</strong> Sie als Host sind allein für die Planung, Durchführung, Sicherheit und Qualität Ihres Events verantwortlich. Dies beinhaltet auch die Einhaltung aller geltenden Gesetze, Vorschriften und die Einholung eventuell notwendiger Genehmigungen.</li>
              <li><strong>Inhalte:</strong> Sie sind für alle von Ihnen bereitgestellten Inhalte (Texte, Bilder, Eventdetails) verantwortlich und gewährleisten, dass diese korrekt sind und keine Rechte Dritter verletzen.</li>
              <li><strong>Teilnehmer-Sicherheit:</strong> Jummix übernimmt keine Haftung für Schäden jeglicher Art (Sach-, Personen- oder Vermögensschäden), die im Rahmen Ihrer Events entstehen. Sie sind verpflichtet, für eine sichere Umgebung zu sorgen.</li>
              <li><strong>Identitätsprüfung:</strong> Jummix führt keine umfassende Identitäts- oder Seriositätsprüfung der Nutzer durch. Sie handeln bei der Interaktion mit anderen Nutzern auf eigene Verantwortung.</li>
              <li><strong>Steuern:</strong> Sie sind allein für die ordnungsgemäße Versteuerung aller Einnahmen aus Ihren Events verantwortlich. Jummix bietet keine Steuerberatung an.</li>
            </ul>
          </li>
          <li><strong>Zahlungsabwicklung:</strong> Die Zahlungsabwicklung erfolgt über den externen Dienstleister Stripe Payments Europe Ltd. Es gelten ergänzend die Datenschutz- und Nutzungsbedingungen des Anbieters. Die Plattform übernimmt keine Haftung für technische oder vertragliche Probleme im Rahmen der Zahlungsabwicklung durch Dritte. Für die Nutzung der Plattform wird eine transparente Servicegebühr (z.B. 10%) direkt vom Ticketpreis einbehalten. Der Restbetrag wird direkt an Ihr verbundenes Stripe-Konto transferiert. Die genaue Gebührenstruktur wird Ihnen beim Erstellen eines kostenpflichtigen Events angezeigt.</li>
          <li><strong>Datennutzung im Verifizierungsprozess:</strong> Die von Ihnen im Rahmen des Host-Verifizierungsantrags bereitgestellten Daten (inkl. Adresse, Dokumente, Links) werden von uns zur Prüfung Ihrer Eignung als Host verwendet. Wir behalten uns das Recht vor, diese Daten zu speichern, um uns für eventuelle Rechtsstreitigkeiten oder bei Anfragen von Behörden abzusichern.</li>
          <li><strong>Technische Verfügbarkeit & Moderation:</strong> Jummix übernimmt keine Gewähr für eine ständige, ununterbrochene technische Verfügbarkeit der Plattform. Wir stellen Melde- und Blockierfunktionen zur Verfügung, führen aber keine permanente Vorabkontrolle aller Nutzerinhalte durch.</li>
        </ol>
      </main>
      <Footer />
    </div>
  );
}
