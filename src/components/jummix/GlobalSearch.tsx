

'use client';

import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, Calendar, User, Building, Wand2, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';

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
        const lowercasedTerm = debouncedSearchTerm.toLowerCase();
        
        const matchingEvents = allEvents.filter(event => 
            event.name.toLowerCase().includes(lowercasedTerm) || 
            event.description.toLowerCase().includes(lowercasedTerm) || 
            event.location.toLowerCase().includes(lowercasedTerm)
        );
        
        const eventResults: Result[] = matchingEvents.map(event => ({
            id: event.id,
            type: 'event',
            name: event.name,
            detail: event.location,
        }))

        setResults(eventResults);

      } catch (error) {
        console.error('Search failed:', error);
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-3 py-2 w-full hover:bg-muted transition-colors justify-between"
            onClick={() => setOpen(true)}
          >
            <div className='flex items-center gap-2'>
              <Search className="h-4 w-4" />
              <span className="flex-grow text-left">Search...</span>
            </div>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
              <CommandInput 
                value={searchTerm}
                onValueChange={setSearchTerm}
                placeholder='Search events...'
              />
            <CommandList>
              {loading && (
                <div className="p-4 flex items-center justify-center text-sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Searching...
                </div>
              )}
              {!loading && !results.length && debouncedSearchTerm.length > 2 && <CommandEmpty>No results found.</CommandEmpty>}
              
              {results.length > 0 && (
                <CommandGroup heading="Events">
                    {results.map((res) => (
                        <CommandItem key={res.id} onSelect={() => handleSelect(res)} value={res.name}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{res.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{res.detail}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
