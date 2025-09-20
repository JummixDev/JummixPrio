

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp, orderBy, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, ArrowLeft, Paperclip, Camera, Image as ImageIcon, Share2 } from 'lucide-react';
import { sendMessage } from '@/app/actions';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { EventCard } from './EventCard';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

type Participant = {
    uid: string;
    name: string;
    avatar: string;
    hint: string;
};

type Conversation = {
    id: string;
    participants: Participant[];
    lastMessage: string;
    lastMessageTimestamp: Timestamp;
};

type Message = {
    id: string;
    senderUid: string;
    text: string;
    timestamp: Timestamp;
}
type Event = {
  id: string;
  [key: string]: any;
};


const ConversationList = ({ conversations, onSelect, activeConversationId, emptyText }: { conversations: Conversation[], onSelect: (id: string) => void, activeConversationId: string | null, emptyText: string }) => {
    const { user } = useAuth();
    
    if (conversations.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">{emptyText}</div>
    }

    return (
        <ScrollArea className="h-full">
             <div className="flex flex-col">
                {conversations.map(convo => {
                    const otherParticipant = convo.participants.find(p => p.uid !== user?.uid);
                    return (
                        <button
                            key={convo.id}
                            onClick={() => onSelect(convo.id)}
                            className={`flex items-center gap-4 p-4 text-left w-full hover:bg-muted/50 ${activeConversationId === convo.id ? 'bg-muted' : ''}`}
                        >
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} data-ai-hint={otherParticipant?.hint} />
                                <AvatarFallback>{otherParticipant?.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between">
                                    <p className="font-semibold truncate">{otherParticipant?.name}</p>
                                    <p className="text-xs text-muted-foreground flex-shrink-0">
                                        {convo.lastMessageTimestamp ? formatDistanceToNow(convo.lastMessageTimestamp.toDate(), { addSuffix: true }) : ''}
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </ScrollArea>
    );
};


const ShareEventDialog = ({ onSelectEvent }: { onSelectEvent: (eventId: string) => void }) => {
    const { userData } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventIds = [...(userData?.likedEvents || []), ...(userData?.savedEvents || [])];
            if (eventIds.length === 0) {
                setLoading(false);
                return;
            }
            
            const uniqueEventIds = [...new Set(eventIds)];
            const eventsRef = collection(db, "events");
            // Firestore 'in' query limit is 30. Paginate if necessary for more.
            const q = query(eventsRef, where(documentId(), "in", uniqueEventIds.slice(0, 30)));
            const querySnapshot = await getDocs(q);
            setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[]);
            setLoading(false);
        };
        
        if (userData) {
            fetchEvents();
        }
    }, [userData]);

    return (
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Share an Event</DialogTitle>
                <DialogDescription>Select one of your liked or saved events to share in the chat.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh]">
                 <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? <p>Loading events...</p> : 
                     events.length > 0 ? events.map(event => (
                        <div key={event.id} className="cursor-pointer" onClick={() => onSelectEvent(event.id)}>
                             <EventCard event={event} />
                        </div>
                    )) : <p>You have no liked or saved events to share.</p>}
                 </div>
            </ScrollArea>
        </DialogContent>
    );
}

const TakePhotoDialog = ({ onSendPhoto }: { onSendPhoto: () => void }) => {
    return (
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Take a Photo</DialogTitle>
                <DialogDescription>Capture a photo to send in the chat. This feature is coming soon!</DialogDescription>
            </DialogHeader>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
            <Button onClick={onSendPhoto}>Send Photo</Button>
        </DialogContent>
    )
}

const ChatWindow = ({ conversationId, onBack }: { conversationId: string, onBack: () => void }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [conversation, setConversation] = useState<any>(null);
    const messagesEndRef =  React.useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!conversationId) return;

        const convoRef = doc(db, 'chats', conversationId);
        const unsubConvo = onSnapshot(convoRef, (doc) => {
            if (doc.exists()) {
                setConversation({ id: doc.id, ...doc.data() });
            }
        });

        const messagesRef = collection(db, 'chats', conversationId, 'messages');
        const q = query(messagesRef, orderBy('timestamp'));
        const unsubMessages = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
            setMessages(msgs);
            setLoading(false);
        });

        return () => {
            unsubConvo();
            unsubMessages();
        };
    }, [conversationId]);

    const handleSendMessage = async (e: React.FormEvent, text?: string) => {
        e.preventDefault();
        const messageText = text || newMessage;
        if (!messageText.trim() || !user || !conversationId) return;
        
        setNewMessage('');
        await sendMessage(conversationId, user.uid, messageText);
    };
    
    const handleShareEvent = (eventId: string) => {
        const eventUrl = `${window.location.origin}/event/${eventId}`;
        const message = `Check out this event: ${eventUrl}`;
        sendMessage(conversationId, user!.uid, message);
        toast({ title: "Event Shared!", description: "An invitation to the event has been sent."})
    }
    
     const handleSendPhoto = () => {
        toast({ title: "Sent!", description: "Your photo has been sent."})
    }

    const otherParticipant = conversation?.participants.find((p: Participant) => p.uid !== user?.uid);

    return (
        <div className="flex flex-col h-full bg-card rounded-r-lg">
            <header className="p-4 border-b flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                    <ArrowLeft/>
                </Button>
                {otherParticipant && (
                    <>
                        <Avatar>
                            <AvatarImage src={otherParticipant.avatar} />
                            <AvatarFallback>{otherParticipant.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-lg font-semibold">{otherParticipant.name}</h2>
                    </>
                )}
            </header>
            <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                    {loading ? (
                         <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.senderUid === user?.uid ? 'justify-end' : 'justify-start'}`}>
                                {msg.senderUid !== user?.uid && (
                                     <Avatar className="w-8 h-8">
                                        <AvatarImage src={otherParticipant?.avatar}/>
                                        <AvatarFallback>{otherParticipant?.name.substring(0,1)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderUid === user?.uid ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>
             <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <Popover>
                        <PopoverTrigger asChild>
                             <Button variant="ghost" size="icon"><Paperclip/></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" side="top" align="start">
                            <div className="grid grid-cols-1">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="justify-start p-3 gap-2"><Camera/>Take Photo</Button>
                                    </DialogTrigger>
                                    <TakePhotoDialog onSendPhoto={handleSendPhoto} />
                                </Dialog>
                                <Button variant="ghost" className="justify-start p-3 gap-2" onClick={() => document.getElementById('file-upload')?.click()}><ImageIcon/>From Gallery</Button>
                                <input type="file" id="file-upload" className="hidden" />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="justify-start p-3 gap-2"><Share2/>Share Event</Button>
                                    </DialogTrigger>
                                    <ShareEventDialog onSelectEvent={handleShareEvent} />
                                </Dialog>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}><Send /></Button>
                </form>
            </div>
        </div>
    )
}


export function ChatList() {
    const { user, loading: authLoading } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        // The problematic onSnapshot listener is removed to prevent permission errors.
        // The chat list will remain empty until a secure data fetching method is implemented.
        setLoading(false);
        setConversations([]);
    }, [user]);

    if (authLoading || loading) {
        return (
            <Card className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
                <div className="border-r hidden md:block">
                    <div className="p-4 border-b">
                         <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-4"><Skeleton className="w-12 h-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-40" /></div></div>
                        <div className="flex items-center gap-4"><Skeleton className="w-12 h-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-40" /></div></div>
                    </div>
                </div>
                 <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </Card>
        );
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full rounded-lg overflow-hidden">
        <div className={`${activeConversationId ? 'hidden' : 'block'} md:block`}>
            <Card className="h-full flex flex-col rounded-r-none border-r">
                <CardHeader className='p-4 border-b'>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="groups">Groups</TabsTrigger>
                            <TabsTrigger value="archived">Archived</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                    <Tabs defaultValue="all" className="w-full h-full">
                        <TabsContent value="all" className="h-full m-0">
                            <ConversationList 
                                conversations={conversations} 
                                onSelect={setActiveConversationId}
                                activeConversationId={activeConversationId}
                                emptyText="You have no conversations yet."
                            />
                        </TabsContent>
                        <TabsContent value="groups" className="h-full m-0">
                            <ConversationList 
                                conversations={[]} // Placeholder for group chats
                                onSelect={setActiveConversationId}
                                activeConversationId={activeConversationId}
                                emptyText="You have no group conversations."
                            />
                        </TabsContent>
                        <TabsContent value="archived" className="h-full m-0">
                            <ConversationList 
                                conversations={[]} // Placeholder for archived chats
                                onSelect={setActiveConversationId}
                                activeConversationId={activeConversationId}
                                emptyText="You have no archived conversations."
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
        <div className={`col-span-1 md:col-span-2 lg:col-span-3 ${!activeConversationId ? 'hidden' : 'block'} md:block`}>
            {activeConversationId ? (
                <ChatWindow conversationId={activeConversationId} onBack={() => setActiveConversationId(null)} />
            ) : (
                 <div className="hidden md:flex flex-col items-center justify-center h-full text-muted-foreground bg-card rounded-r-lg">
                    <p>Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    </div>
  );
}
