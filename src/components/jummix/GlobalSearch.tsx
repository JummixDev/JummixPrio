

'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Calendar, User, Building } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

type UserResult = {
    id: string;
    type: 'user' | 'host';
    name: string;
    username: string;
};
type EventResult = {
    id: string;
    type: 'event';
    name: string;
    location: string;
};
type SearchResult = UserResult | EventResult;

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
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
      if (debouncedSearchTerm.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);

      try {
        // Search users
        const usersRef = collection(db, 'users');
        const userQuery = query(
          usersRef,
          where('displayName', '>=', debouncedSearchTerm),
          where('displayName', '<=', debouncedSearchTerm + '\uf8ff'),
          limit(5)
        );
        const userDocs = await getDocs(userQuery);
        const userResults: UserResult[] = userDocs.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                type: data.isVerifiedHost ? 'host' : 'user',
                name: data.displayName,
                username: data.username,
            }
        });
        
        // Search events
        const eventsRef = collection(db, 'events');
        const eventQuery = query(
          eventsRef,
          where('name', '>=', debouncedSearchTerm),
          where('name', '<=', debouncedSearchTerm + '\uf8ff'),
          limit(3)
        );
        const eventDocs = await getDocs(eventQuery);
        const eventResults: EventResult[] = eventDocs.docs.map(doc => ({
            id: doc.id,
            type: 'event',
            name: doc.data().name,
            location: doc.data().location,
        }));
        
        setResults([...userResults, ...eventResults]);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);
  
  const handleSelect = (result: SearchResult) => {
    let url = '';
    if (result.type === 'event') url = `/event/${result.id}`;
    if (result.type === 'user') url = `/profile/${result.username}`;
    if (result.type === 'host') url = `/hosts/${result.username}`;
    
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
        <Search className="h-4 w-4" />
        <span className="flex-grow text-left">Search events, people...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
            <DialogTitle>Global Search</DialogTitle>
        </DialogHeader>
        <CommandInput 
            placeholder="Type to search for events, people, or locations..."
            value={searchTerm}
            onValueChange={setSearchTerm}
        />
        <CommandList>
          {loading && <CommandEmpty>Searching...</CommandEmpty>}
          {!loading && !results.length && debouncedSearchTerm.length > 1 && <CommandEmpty>No results found.</CommandEmpty>}
          
          {results.length > 0 && (
            <CommandGroup heading="Results">
                {results.map((res) => (
                    <CommandItem key={res.id} onSelect={() => handleSelect(res)}>
                        {res.type === 'event' && <Calendar className="mr-2 h-4 w-4" />}
                        {res.type === 'user' && <User className="mr-2 h-4 w-4" />}
                        {res.type === 'host' && <Building className="mr-2 h-4 w-4" />}
                        <span>{res.name}</span>
                        {res.type === 'event' && <span className="text-xs text-muted-foreground ml-auto">{res.location}</span>}
                    </CommandItem>
                ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
    