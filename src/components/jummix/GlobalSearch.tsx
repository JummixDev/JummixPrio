

'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, Calendar, User, Building, Wand2, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { getAISearchResults } from '@/app/actions';
import { Input } from '../ui/input';

type Result = {
    id: string;
    type: 'user' | 'host' | 'event';
    name: string;
    detail: string;
};

// Cache all events to avoid re-fetching
let allEventsCache: any[] | null = null;
const fetchAllEvents = async () => {
    if (allEventsCache) return allEventsCache;
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    allEventsCache = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allEventsCache;
}


export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<Result[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);

      try {
        const allEvents = await fetchAllEvents();
        const aiInput = {
            query: debouncedSearchTerm,
            events: allEvents.map(e => ({
                id: e.id,
                name: e.name,
                description: e.description,
                location: e.location
            }))
        };
        const aiResult = await getAISearchResults(aiInput);
        
        const matchingEvents = allEvents.filter(e => aiResult.matchingEventIds.includes(e.id));
        
        const eventResults: Result[] = matchingEvents.map(event => ({
            id: event.id,
            type: 'event',
            name: event.name,
            detail: event.location,
        }))

        setResults(eventResults);

      } catch (error) {
        console.error('AI Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);
  
  const handleSelect = (result: Result) => {
    let url = '';
    if (result.type === 'event') url = `/event/${result.id}`;
    if (result.type === 'user') url = `/profile/${result.detail}`;
    if (result.type === 'host') url = `/hosts/${result.detail}`;
    
    if (url) {
      router.push(url);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground bg-background border rounded-md px-3 py-2 w-full hover:bg-muted transition-colors"
      >
        <Wand2 className="h-4 w-4 text-primary" />
        <span className="flex-grow text-left">Search with AI...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Wand2 className="mr-2 h-4 w-4 shrink-0 text-primary" />
            <Input
                placeholder='Try "a relaxed jazz event for this weekend"'
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-base resize-none border-0 shadow-none focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <CommandList>
          {loading && (
            <CommandEmpty>
                <div className="flex items-center justify-center p-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Searching with AI...
                </div>
            </CommandEmpty>
          )}
          {!loading && !results.length && debouncedSearchTerm.length > 2 && <CommandEmpty>No results found.</CommandEmpty>}
          
          {results.length > 0 && (
            <CommandGroup heading="AI Recommendations">
                {results.map((res) => (
                    <CommandItem key={res.id} onSelect={() => handleSelect(res)}>
                        {res.type === 'event' && <Calendar className="mr-2 h-4 w-4" />}
                        {res.type === 'user' && <User className="mr-2 h-4 w-4" />}
                        {res.type === 'host' && <Building className="mr-2 h-4 w-4" />}
                        <span>{res.name}</span>
                        {res.type === 'event' && <span className="text-xs text-muted-foreground ml-auto">{res.detail}</span>}
                    </CommandItem>
                ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
