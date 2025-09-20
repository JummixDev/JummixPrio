
'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const mockArchivedStories = [
    { id: 1, image: 'https://placehold.co/600x800.png', hint: 'event story photo', date: '2024-07-20' },
    { id: 2, image: 'https://placehold.co/600x800.png', hint: 'behind the scenes', date: '2024-07-18' },
    { id: 3, image: 'https://placehold.co/600x800.png', hint: 'concert announcement', date: '2024-07-15' },
    { id: 4, image: 'https://placehold.co/600x800.png', hint: 'workshop promotion', date: '2024-07-12' },
    { id: 5, image: 'https://placehold.co/600x800.png', hint: 'q&a session', date: '2024-07-10' },
];

const StoryTile = ({ story }: { story: (typeof mockArchivedStories)[0] }) => (
    <div className="block group relative aspect-[9/16] overflow-hidden rounded-lg">
        <Image 
            src={story.image} 
            alt={`Archived story from ${story.date}`}
            layout="fill" 
            objectFit="cover" 
            className="transition-transform duration-300 ease-in-out group-hover:scale-110"
            data-ai-hint={story.hint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
            <p className="text-sm font-semibold">Posted on {new Date(story.date).toLocaleDateString()}</p>
        </div>
    </div>
);

export default function StoryArchivePage() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/host/dashboard">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Story Archive</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow pt-16 pb-24">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mockArchivedStories.map((story) => (
                        <StoryTile key={story.id} story={story} />
                    ))}
                </div>
            </main>
        </div>
    );
}
