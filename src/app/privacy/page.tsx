
import { Footer } from '@/components/jummix/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-stone dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <p>
          <em>This is a sample text and does not constitute a legally binding privacy policy. For a legally sound declaration, you should consult a lawyer or data protection officer.</em>
        </p>

        <h2 id="controller">1. Controller</h2>
        <p>
          The controller within the meaning of the General Data Protection Regulation (GDPR) is:
          <br />
          Jummix Events (Sample Company)
          <br />
          Sample Street 1
          <br />
          12345 Sample City
          <br />
          Email: privacy@jummix.com
        </p>

        <h2 id="data">2. Collection and Storage of Personal Data</h2>
        <p>We collect and process personal data to provide, improve, and secure our services. This includes:</p>
        <ul>
          <li><strong>Account Information:</strong> When you register, we collect your name, email address, and password. Voluntary information such as profile picture, biography, interests, location, and date of birth are also stored.</li>
          <li><strong>Usage Data:</strong> Information about your interactions with the platform (e.g., attended events, likes, saved events, created content).</li>
          <li><strong>Payment Data:</strong> For paid events, your payment data is securely processed by our partner Stripe. We do not store complete credit card numbers.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, operating system, and device information.</li>
          <li><strong>Communication Data:</strong> Content of your messages in chats and communication with our support.</li>
        </ul>

        <h2 id="purpose">3. Purpose and Legal Basis of Data Processing</h2>
        <p>The processing of your data is based on the GDPR:</p>
        <ul>
          <li><strong>Performance of a Contract (Art. 6(1)(b) GDPR):</strong> To provide the core functions of Jummix.</li>
          <li><strong>Legitimate Interests (Art. 6(1)(f) GDPR):</strong> To improve our services, for fraud prevention, and for personalized recommendations.</li>
          <li><strong>Consent (Art. 6(1)(a) GDPR):</strong> For optional features such as cookies for analysis purposes.</li>
        </ul>

        <h2 id="cookies">4. Cookies</h2>
        <p>Our website uses cookies. These are small text files that are stored on your device. We use technically necessary cookies to ensure the basic functionality of the site. For all other cookies (e.g., for analysis or marketing purposes), we obtain your express consent via a cookie banner. You can revoke your consent at any time.</p>

        <h2 id="rights">5. Your Rights as a Data Subject</h2>
        <p>You have the right to information, correction, deletion, restriction of processing, data portability, and the right to object to the processing of your personal data. You can make many of these settings directly in your profile or contact us at the email address mentioned above. You also have the right to lodge a complaint with a data protection supervisory authority.</p>
      </main>
    </div>
  );
}
