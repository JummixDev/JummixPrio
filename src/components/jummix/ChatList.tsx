

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { sendMessage } from '@/app/actions';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

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

const ConversationList = ({ conversations, onSelect, activeConversationId }: { conversations: Conversation[], onSelect: (id: string) => void, activeConversationId: string | null }) => {
    const { user } = useAuth();

    return (
        <div className="border-r">
            <h2 className="p-4 text-lg font-semibold border-b">Conversations</h2>
            <ScrollArea className="h-[calc(100%-4rem)]">
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
        </div>
    );
};

const ChatWindow = ({ conversationId, onBack }: { conversationId: string, onBack: () => void }) => {
    const { user } = useAuth();
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

        // Fetch conversation details (like participant names)
        const convoRef = doc(db, 'chats', conversationId);
        const unsubConvo = onSnapshot(convoRef, (doc) => {
            if (doc.exists()) {
                setConversation({ id: doc.id, ...doc.data() });
            }
        });

        // Listen for messages in the conversation
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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !conversationId) return;
        
        const textToSend = newMessage;
        setNewMessage(''); // Clear input optimistically

        await sendMessage(conversationId, user.uid, textToSend);
        // Message will appear via the onSnapshot listener
    };

    const otherParticipant = conversation?.participants.find((p: Participant) => p.uid !== user?.uid);

    return (
        <div className="flex flex-col h-full">
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
                <form onSubmit={handleSendMessage} className="flex gap-2">
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
        if (!user) return;

        setLoading(true);
        const q = query(
            collection(db, 'chats'), 
            where('participantUids', 'array-contains', user.uid),
            orderBy('lastMessageTimestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const convos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Conversation[];
            setConversations(convos);
            // Set the first conversation as active by default if none is selected
            if (!activeConversationId && convos.length > 0) {
                setActiveConversationId(convos[0].id);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, activeConversationId]);

    if (authLoading || loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full border rounded-lg">
                <div className="border-r hidden md:block">
                    <h2 className="p-4 text-lg font-semibold border-b"><Skeleton className="h-6 w-32" /></h2>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-4"><Skeleton className="w-12 h-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-40" /></div></div>
                        <div className="flex items-center gap-4"><Skeleton className="w-12 h-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-40" /></div></div>
                    </div>
                </div>
                 <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }
    
    if (conversations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full border rounded-lg">
                <p className="text-muted-foreground">You have no conversations yet.</p>
            </div>
        )
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full border rounded-lg overflow-hidden">
        <div className={`${activeConversationId ? 'hidden' : 'block'} md:block`}>
            <ConversationList 
                conversations={conversations} 
                onSelect={setActiveConversationId}
                activeConversationId={activeConversationId}
            />
        </div>
        <div className={`col-span-1 md:col-span-2 lg:col-span-3 ${!activeConversationId ? 'hidden' : 'block'} md:block`}>
            {activeConversationId ? (
                <ChatWindow conversationId={activeConversationId} onBack={() => setActiveConversationId(null)} />
            ) : (
                 <div className="hidden md:flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p>Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    </div>
  );
}
