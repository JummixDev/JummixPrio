

'use client';

import * as React from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Search, Calendar, User, Building, Wand2, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

type Result = {
    id: string;
    type: 'user' | 'host' | 'event';
    name: string;
    detail: string;
    url: string;
};

// Caches to avoid re-fetching on every search
let allEventsCache: any[] | null = null;
const fetchAllEvents = async () => {
    if (allEventsCache) return allEventsCache;
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    allEventsCache = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allEventsCache;
}

let allUsersCache: any[] | null = null;
const fetchAllUsers = async () => {
    if (allUsersCache) return allUsersCache;
    const usersSnapshot = await getDocs(collection(db, 'users'));
    allUsersCache = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allUsersCache;
}


export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [eventResults, setEventResults] = React.useState<Result[]>([]);
  const [userResults, setUserResults] = React.useState<Result[]>([]);
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
        setEventResults([]);
        setUserResults([]);
        return;
      }
      setLoading(true);

      try {
        const [allEvents, allUsers] = await Promise.all([fetchAllEvents(), fetchAllUsers()]);
        const lowercasedTerm = debouncedSearchTerm.toLowerCase();
        
        // Filter Events
        const matchingEvents = allEvents.filter(event => 
            event.name.toLowerCase().includes(lowercasedTerm) || 
            event.description.toLowerCase().includes(lowercasedTerm) || 
            event.location.toLowerCase().includes(lowercasedTerm)
        ).slice(0, 5); // Limit results
        
        setEventResults(matchingEvents.map(event => ({
            id: event.id,
            type: 'event',
            name: event.name,
            detail: event.location,
            url: `/event/${event.id}`,
        })));

        // Filter Users
        const matchingUsers = allUsers.filter(user =>
            user.displayName.toLowerCase().includes(lowercasedTerm) ||
            user.username.toLowerCase().includes(lowercasedTerm)
        ).slice(0, 5); // Limit results

        setUserResults(matchingUsers.map(user => ({
            id: user.id,
            type: user.isVerifiedHost ? 'host' : 'user',
            name: user.displayName,
            detail: `@${user.username}`,
            url: user.isVerifiedHost ? `/hosts/${user.username}` : `/profile/${user.username}`,
        })));

      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearchTerm) {
      performSearch();
    } else {
      setEventResults([]);
      setUserResults([]);
    }
  }, [debouncedSearchTerm]);
  
  const handleSelect = (url: string) => {
    router.push(url);
    setOpen(false);
    setSearchTerm('');
  }

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden lg:inline-block">Search...</span>
        <span className="inline-block lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
         <CommandInput 
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search for events, people, or places..."
         />
        <CommandList>
            {loading && (
            <div className="p-4 flex items-center justify-center text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Searching...
            </div>
            )}
            {!loading && !eventResults.length && !userResults.length && debouncedSearchTerm.length > 1 && (
                 <CommandEmpty>No results found.</CommandEmpty>
            )}
            
            {userResults.length > 0 && (
            <CommandGroup heading="People">
                {userResults.map((res) => (
                    <CommandItem key={res.id} onSelect={() => handleSelect(res.url)} value={`${res.name} ${res.detail}`}>
                        {res.type === 'host' ? <Building className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                        <span>{res.name}</span>
                         <span className="text-xs text-muted-foreground ml-2">{res.detail}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
            )}
            {eventResults.length > 0 && (
                <CommandGroup heading="Events">
                    {eventResults.map((res) => (
                        <CommandItem key={res.id} onSelect={() => handleSelect(res.url)} value={res.name}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{res.name}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
