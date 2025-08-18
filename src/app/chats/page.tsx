

'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ChatsPageContent from './page';


// This is now a wrapper page component to provide the standard page layout
export default function ChatsPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Chats</h1>
          </div>
      </header>
       <main className="container mx-auto p-0 md:p-4 pt-16 flex-grow">
            <div className="h-[calc(100vh-10.5rem)]">
                <ChatsPageContent/>
            </div>
      </main>
    </div>
  );
}
