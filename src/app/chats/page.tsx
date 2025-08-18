
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Paperclip, Send, Camera, MessageSquare, Loader2, Image as ImageIcon, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { sendMessage } from '../actions';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define types for our data for better safety
type Conversation = {
    id: string;
    participants: { uid: string; name: string; avatar: string; hint: string; }[];
    lastMessage: string;
    lastMessageTimestamp: Timestamp;
    isGroup: boolean;
    groupName?: string;
    groupAvatar?: string;
};

type Message = {
    id: string;
    senderUid: string;
    text: string;
    timestamp: Timestamp;
};

const formatTimeAgo = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    const now = new Date();
    const messageDate = timestamp.toDate();
    const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
};

export default function ChatsPage() {
    const { user, loading: authLoading, userData } = useAuth();
    const { toast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);


    // Fetch conversations for the current user
    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const q = query(collection(db, 'chats'), where('participantUids', 'array-contains', user.uid));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userConversations: Conversation[] = [];
            querySnapshot.forEach((doc) => {
                userConversations.push({ id: doc.id, ...doc.data() } as Conversation);
            });
            // Sort by most recent message
            userConversations.sort((a, b) => b.lastMessageTimestamp?.toMillis() - a.lastMessageTimestamp?.toMillis());
            setConversations(userConversations);
            setLoading(false);
            
            // Auto-select the first conversation if none is selected
            if (!selectedConversation && userConversations.length > 0) {
              setSelectedConversation(userConversations[0]);
            }
        });

        return () => unsubscribe();
    }, [user, selectedConversation]);

    // Fetch messages for the selected conversation
    useEffect(() => {
        if (!selectedConversation) {
            setMessages([]);
            return;
        };

        const messagesRef = collection(db, 'chats', selectedConversation.id, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const conversationMessages: Message[] = [];
            querySnapshot.forEach((doc) => {
                conversationMessages.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(conversationMessages);
        });

        return () => unsubscribe();
    }, [selectedConversation]);
    
    // Auto-scroll to the bottom of the messages
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
              top: scrollAreaRef.current.scrollHeight,
              behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedConversation || !user) return;
        const textToSend = messageText;
        setMessageText(''); // Clear input immediately for better UX
        const result = await sendMessage(selectedConversation.id, user.uid, textToSend);

        if (!result.success) {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
            setMessageText(textToSend); // Restore text if sending failed
        }
    };
    
    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-bold font-headline text-primary">Lade Ihr Erlebnis mit Jummix</h1>
            </div>
        )
    }
    
    const getConversationDisplay = (convo: Conversation | null) => {
        if (!convo) return { name: 'Chats', avatar: '', hint: '', username: '', online: false };
        if (convo.isGroup) {
            return {
                name: convo.groupName || 'Group Chat',
                avatar: convo.groupAvatar || 'https://placehold.co/40x40.png',
                hint: 'group icon',
                username: convo.id,
                online: false,
            }
        }
        const otherParticipant = convo.participants.find(p => p.uid !== user?.uid);
        return {
            name: otherParticipant?.name || 'Unknown User',
            avatar: otherParticipant?.avatar || 'https://placehold.co/40x40.png',
            hint: otherParticipant?.hint || 'person portrait',
            username: otherParticipant?.uid || 'unknown',
            online: false, // Online status would require another system like Firestore presence
        }
    }

    const currentChatPartner = getConversationDisplay(selectedConversation);


  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-16 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
               {selectedConversation && (
                <Link href={`/profile/${currentChatPartner.username}`} className="flex items-center gap-3 ml-2 group">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={currentChatPartner.avatar} alt={currentChatPartner.name} data-ai-hint={currentChatPartner.hint} />
                        <AvatarFallback>{currentChatPartner.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <h1 className="text-lg font-bold group-hover:underline">{currentChatPartner.name}</h1>
                        {currentChatPartner.online && <p className="text-xs text-green-500 -mt-1">Online</p>}
                    </div>
                </Link>
              )}
              {!selectedConversation && <h1 className="text-xl font-bold ml-4">Chats</h1>}
          </div>
      </header>
       <main className="flex-grow container mx-auto p-0 md:p-4 pt-16">
        <div className="grid grid-cols-12 border rounded-lg h-[calc(100vh-10.5rem)] bg-card overflow-hidden">
            {/* Left Column: Conversation List */}
            <aside className="col-span-12 md:col-span-4 lg:col-span-3 border-r flex flex-col">
                 <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search chats..." className="pl-10" />
                    </div>
                </div>
                <Tabs defaultValue="all" className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-3 px-4 pt-2">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="groups">Groups</TabsTrigger>
                        <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="flex-grow">
                        <TabsContent value="all" className="m-0">
                            {conversations.map(convo => {
                                const display = getConversationDisplay(convo);
                                return (
                                <div key={convo.id}
                                    onClick={() => setSelectedConversation(convo)}
                                    className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 ${selectedConversation?.id === convo.id ? 'bg-muted' : ''}`}>
                                    <Avatar className="w-12 h-12 relative">
                                        <AvatarImage src={display.avatar} alt={display.name} data-ai-hint={display.hint} />
                                        <AvatarFallback>{display.name.substring(0,2)}</AvatarFallback>
                                        {display.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />}
                                    </Avatar>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-semibold truncate">{display.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatTimeAgo(convo.lastMessageTimestamp)}</span>
                                </div>
                            )})}
                        </TabsContent>
                         <TabsContent value="groups" className="m-0 text-center p-8 text-muted-foreground">
                            <p>Group chats will appear here.</p>
                        </TabsContent>
                         <TabsContent value="archived" className="m-0 text-center p-8 text-muted-foreground">
                            <p>Archived chats will appear here.</p>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </aside>

            {/* Right Column: Chat Window */}
             <section className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col h-full">
                {selectedConversation ? (
                    <>
                        {/* Messages */}
                        <ScrollArea className="flex-grow" ref={scrollAreaRef}>
                            <div className="space-y-4 p-4">
                                {messages.map((msg) => {
                                    const isMe = msg.senderUid === user?.uid;
                                    const senderInfo = selectedConversation.participants.find(p => p.uid === msg.senderUid);
                                    return (
                                     <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : ''}`}>
                                        {!isMe && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={senderInfo?.avatar} alt={senderInfo?.name} data-ai-hint={senderInfo?.hint} />
                                                <AvatarFallback>{senderInfo?.name.substring(0,2)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>{formatTimeAgo(msg.timestamp)}</p>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </ScrollArea>

                        {/* Chat Input */}
                        <div className="p-4 border-t bg-background/80">
                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                                <Input 
                                  placeholder="Type a message..." 
                                  className="pr-24"
                                  value={messageText}
                                  onChange={(e) => setMessageText(e.target.value)}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button type="button" variant="ghost" size="icon">
                                                <Paperclip className="w-5 h-5"/>
                                                <span className="sr-only">Attach Content</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Camera className="mr-2 h-4 w-4" />
                                                Foto aufnehmen
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <ImageIcon className="mr-2 h-4 w-4" />
                                                Aus Galerie wählen
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Share2 className="mr-2 h-4 w-4" />
                                                Event teilen
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button type="submit" size="icon" className="ml-2 w-10 h-8 rounded-full">
                                        <Send className="w-5 h-5"/>
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageSquare className="w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-semibold">Select a conversation</h2>
                        <p>Start chatting with your friends and event groups.</p>
                    </div>
                )}

            </section>
        </div>
      </main>
      {/* The footer is removed from the chat page to provide a full-screen experience */}
    </div>
  );
}
