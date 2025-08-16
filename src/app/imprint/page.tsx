
import Link from 'next/link';

export default function ImprintPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Imprint (Impressum)</h1>
      <p className="mb-4">
        Placeholder for your Imprint. Please replace this with your actual legal information.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
