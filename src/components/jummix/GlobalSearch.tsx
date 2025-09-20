
'use client';

import * as React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, Calendar, User, Building, Loader2, X } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

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
};

let allUsersCache: any[] | null = null;
const fetchAllUsers = async () => {
    if (allUsersCache) return allUsersCache;
    const usersSnapshot = await getDocs(collection(db, 'users'));
    allUsersCache = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return allUsersCache;
};

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [eventResults, setEventResults] = React.useState<Result[]>([]);
  const [userResults, setUserResults] = React.useState<Result[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

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
        
        const matchingEvents = allEvents.filter(event => 
            event.name.toLowerCase().includes(lowercasedTerm) || 
            event.description.toLowerCase().includes(lowercasedTerm) || 
            event.location.toLowerCase().includes(lowercasedTerm)
        ).slice(0, 5);
        
        setEventResults(matchingEvents.map(event => ({
            id: event.id, type: 'event', name: event.name, detail: event.location, url: `/event/${event.id}`,
        })));

        const matchingUsers = allUsers.filter(user =>
            user.displayName.toLowerCase().includes(lowercasedTerm) ||
            user.username.toLowerCase().includes(lowercasedTerm)
        ).slice(0, 5);

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

    if (open && debouncedSearchTerm) {
      performSearch();
    } else {
      setEventResults([]);
      setUserResults([]);
    }
  }, [debouncedSearchTerm, open]);
  
  const handleSelect = (url: string) => {
    router.push(url);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div 
        className={cn(
            "relative flex items-center h-10 w-full rounded-full border bg-secondary transition-all duration-300 ease-in-out",
            open ? "bg-background shadow-md" : "hover:bg-muted"
        )}>
        <div className="pl-4 pr-2 absolute left-0 top-0 bottom-0 flex items-center">
            <Search className={cn("h-5 w-5 text-muted-foreground transition-colors", open && "text-primary")} />
        </div>
        <input
            ref={inputRef}
            value={searchTerm}
            onFocus={() => setOpen(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events, people..."
            className="h-full w-full bg-transparent pl-12 pr-4 text-sm outline-none placeholder:text-muted-foreground"
        />
        {searchTerm && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full absolute right-1" onClick={() => setSearchTerm('')}>
                <X className="h-4 w-4"/>
            </Button>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-2 w-full">
            <Command className="rounded-lg border shadow-md">
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
            </Command>
        </div>
      )}
    </div>
  );
}

    