
import { Footer } from '@/components/jummix/Footer';
import Link from 'next/link';

export default function ImprintPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-stone dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Imprint</h1>
        
        <p>
          <em>This is a sample imprint and is for demonstration purposes only. It does not constitute legal advice.</em>
        </p>

        <h2>Information according to § 5 TMG</h2>
        <p>
          Jummix Events (Sample Company)<br />
          Sample Street 1<br />
          12345 Sample City
        </p>

        <h2>Contact</h2>
        <p>
          Email: service@jummix.com
        </p>

        <h2>Responsible for the content according to § 55 Abs. 2 RStV</h2>
        <p>
          Max Mustermann<br />
          Sample Street 1<br />
          12345 Sample City
        </p>

        <h2 id="disclaimer">Disclaimer</h2>

        <h3>General Disclaimer</h3>
        <p><strong>Liability for Content:</strong> As a service provider, we are responsible for our own content on these pages in accordance with § 7 Abs.1 TMG and general laws. However, according to §§ 8 to 10 TMG, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.</p>
        <p><strong>Liability for Links:</strong> Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages.</p>
        <p><strong>Liability for User Content:</strong> We do not endorse content posted by third parties (e.g., users, organizers, or hosts). The respective users are solely responsible for the legality, accuracy, and completeness of such content. Upon notification of unlawful or problematic content, we will remove it immediately.</p>
        <p><strong>Technical Availability:</strong> We strive to keep the website available without interruption. However, no liability can be assumed for constant availability or for technically-related delays, interruptions, or failures. Likewise, we are not liable for damages caused by the use or non-use of the information provided or by incorrect or incomplete information.</p>
        <p><strong>No Advice:</strong> The contents of this website do not constitute binding advice and do not replace individual legal, tax, medical, or other professional advice. They are for general information purposes only. We assume no liability for actions taken on the basis of this content.</p>
        <p><strong>Reservation of Changes:</strong> We expressly reserve the right to change, supplement, or delete parts of the pages or the entire offer without separate announcement, or to cease publication temporarily or permanently.</p>
        <p><strong>Legal Validity of this Disclaimer:</strong> This disclaimer is to be regarded as part of the internet publication. If individual formulations or parts of this text do not, no longer, or not completely correspond to the current legal situation, the remaining parts of the document remain unaffected in their content and validity.</p>

        <h3>Additional Disclaimer for Organizers (Hosts)</h3>
        <ol>
          <li><strong>Role of Jummix:</strong> Jummix is a mediation platform that brings users and organizers (hosts) together. We are not the organizer, operator, or person responsible for the events offered on the platform. The contract for participation in an event is concluded exclusively between the participant and the host.</li>
          <li><strong>Responsibility and Liability of the Host:</strong>
            <ul>
              <li><strong>Event Execution:</strong> You as the host are solely responsible for the planning, execution, safety, and quality of your event. This also includes compliance with all applicable laws, regulations, and obtaining any necessary permits.</li>
              <li><strong>Content:</strong> You are responsible for all content you provide (texts, images, event details) and ensure that it is correct and does not violate the rights of third parties.</li>
              <li><strong>Participant Safety:</strong> Jummix assumes no liability for damages of any kind (property, personal, or financial) that occur in connection with your events. You are obligated to provide a safe environment.</li>
              <li><strong>Identity Verification:</strong> Jummix does not conduct a comprehensive identity or reliability check of users. You act at your own risk when interacting with other users.</li>
              <li><strong>Taxes:</strong> You are solely responsible for the proper taxation of all income from your events. Jummix does not offer tax advice.</li>
            </ul>
          </li>
          <li><strong>Payment Processing:</strong> Payment processing is handled by the external service provider Stripe Payments Europe Ltd. The data protection and terms of use of the provider apply in addition. The platform assumes no liability for technical or contractual problems in the context of payment processing by third parties. A transparent service fee (e.g., 10%) is deducted directly from the ticket price for the use of the platform. The remaining amount is transferred directly to your connected Stripe account. The exact fee structure will be displayed to you when creating a paid event.</li>
          <li><strong>Data Usage in the Verification Process:</strong> The data you provide in the host verification application (including address, documents, links) will be used by us to check your suitability as a host. We reserve the right to store this data to protect ourselves in the event of legal disputes or inquiries from authorities.</li>
          <li><strong>Technical Availability & Moderation:</strong> Jummix does not guarantee constant, uninterrupted technical availability of the platform. We provide reporting and blocking functions but do not perform permanent pre-screening of all user content.</li>
        </ol>
      </main>
    </div>
  );
}
