
import { Footer } from '@/components/jummix/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-stone dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions (GTC)</h1>
        <p className="text-sm text-muted-foreground">Last updated: June 29, 2025</p>

        <p>
          <em>Please note that this is a sample text and does not constitute legally binding terms and conditions. You should consult a lawyer for legally sound terms and conditions.</em>
        </p>

        <h2 id="scope">1. Scope and Provider</h2>
        <p>These General Terms and Conditions (GTC) govern the use of the event platform "Jummix" (hereinafter "Platform"), operated by Jummix Events (Sample Company). By registering and using our services, you agree to these terms in their currently valid version.</p>

        <h2 id="services">2. Services of Jummix</h2>
        <p>Jummix provides an online platform where users can discover events, connect with others, and participate. Verified users ("Hosts") can also create and manage their own events. Unless explicitly stated otherwise, Jummix is merely the intermediary for the events offered on the platform and not the organizer. The contract for participation in an event is concluded exclusively between the participant and the respective host.</p>

        <h2 id="user-account">3. User Account and Obligations of Users</h2>
        <p>Registration requires the provision of correct and complete information. You are responsible for the security of your password and all activities that occur through your account. You agree to comply with applicable law when using Jummix and not to publish any content that is illegal, offensive, misleading, pornographic, or violates the rights of third parties. Jummix assumes no liability for the identity or seriousness of its users. Users are responsible for verifying the authenticity of profiles and information themselves.</p>

        <h2 id="hosts">4. Special Obligations for Organizers (Hosts)</h2>
        <p>As a host, you are responsible for the correct, complete, and truthful description of your event. You guarantee that you have all the necessary licenses, permits, and insurance for the execution of the event. You are the sole contractual partner of the participants for the event you offer and are responsible for fulfilling all related obligations (execution, safety, possible refunds). Hosts must be of legal age (at least 18 years old). Jummix is not liable for the cancellation, defects, or damages that occur in the context of events. Hosts are also responsible for the taxation of their income themselves.</p>

        <h2 id="payment">5. Payment Processing and Fees</h2>
        <p>The processing of payments for paid events is handled by our external payment service provider Stripe using Stripe Connect. Jummix is not part of the payment flow between the participant and the host but merely facilitates the payment technically. For the mediation and use of the platform, we charge a service fee, which is deducted directly from the ticket price.</p>
        <p><strong>Example (Split Payment):</strong> A participant pays 50 €. Of this, for example, 10 € (20% service fee) goes to Jummix and 40 € is transferred directly to the host's Stripe account. The exact fee amount will be transparently displayed to you when creating a paid event and in the checkout process. The terms and conditions and privacy policy of Stripe apply.</p>

        <h2 id="liability">6. Liability and Content</h2>
        <p>Jummix is not liable for the execution, quality, safety, or possible cancellation of the events offered on the platform. Any claims arising from participation in or execution of an event must be directed to the respective host. The content created by users and hosts (e.g., event descriptions, comments) is third-party content for which Jummix assumes no responsibility. We reserve the right to remove content that violates our guidelines. We offer a reporting function but cannot guarantee complete monitoring. The platform is provided without guarantee of constant technical availability.</p>

        <h2 id="changes">7. Changes to the GTC</h2>
        <p>We reserve the right to adapt these GTC at any time to adapt them to changed legal or technical framework conditions. We will inform you in good time of any significant changes by email or by a notice on the platform. Your continued use of the platform after the changes come into effect will be deemed your consent.</p>
      </main>
    </div>
  );
}
