
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        Placeholder for your Privacy Policy. Please replace this with your actual policy.
      </p>
      <Link href="/" className="text-primary hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
