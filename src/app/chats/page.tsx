
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Paperclip, Send, Camera, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Footer } from '@/components/jummix/Footer';


const mockConversations = [
    { id: 1, name: 'Jenna Smith', lastMessage: 'See you there!', time: '10m', avatar: 'https://placehold.co/40x40.png', hint: 'woman portrait', online: true },
    { id: 2, name: 'Summer Music Fest Group', lastMessage: 'Aisha: The lineup is amazing!', time: '2h', avatar: 'https://placehold.co/40x40.png', hint: 'concert crowd' },
    { id: 3, name: 'Carlos Ray', lastMessage: 'Let\'s connect after the summit.', time: '1d', avatar: 'https://placehold.co/40x40.png', hint: 'man portrait' },
    { id: 4, name: 'Tech Innovators Summit', lastMessage: 'Official announcements here.', time: '3d', avatar: 'https://placehold.co/40x40.png', hint: 'tech logo' },
    { id: 5, name: 'Alex Doe', lastMessage: 'You sent a photo.', time: '5d', avatar: 'https://placehold.co/40x40.png', hint: 'person portrait' },
];

const mockMessages: { [key: string]: any[] } = {
    '1': [
        { sender: 'Jenna Smith', text: 'Hey! Are you excited for the music fest?', time: '15m', me: false },
        { sender: 'Me', text: 'Absolutely! Can\'t wait. The lineup looks incredible.', time: '14m', me: true },
        { sender: 'Jenna Smith', text: 'I know, right? We should meet up by the main stage.', time: '12m', me: false },
        { sender: 'Me', text: 'Sounds like a plan! I\'ll text you when I get there.', time: '11m', me: true },
        { sender: 'Jenna Smith', text: 'See you there!', time: '10m', me: false },
    ],
    '2': [
        { sender: 'Alex Doe', text: 'Who is everyone most excited to see?', time: '3h', me: false },
        { sender: 'Aisha Khan', text: 'The lineup is amazing!', time: '2h', me: false },
    ],
    '3': [
        { sender: 'Carlos Ray', text: 'Let\'s connect after the summit.', time: '1d', me: false },
    ],
};


export default function ChatsPage() {
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    
    // Set a default selected conversation on initial render
    useState(() => {
        setSelectedConversation(mockConversations[0]);
        return null;
    });

    const messages = selectedConversation ? (mockMessages as any)[selectedConversation.id] || [] : [];

  return (
    <div className="bg-background min-h-screen flex flex-col">
       <header className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard">
                      <ArrowLeft />
                  </Link>
              </Button>
              <h1 className="text-xl font-bold ml-4">Chats</h1>
          </div>
      </header>
       <main className="flex-grow container mx-auto p-0 md:p-4">
        <div className="grid grid-cols-12 border rounded-lg h-[calc(100vh-10rem)] bg-card overflow-hidden">
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
                            {mockConversations.map(convo => (
                                <div key={convo.id}
                                    onClick={() => setSelectedConversation(convo)}
                                    className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 ${selectedConversation?.id === convo.id ? 'bg-muted' : ''}`}>
                                    <Avatar className="w-12 h-12 relative">
                                        <AvatarImage src={convo.avatar} alt={convo.name} data-ai-hint={convo.hint} />
                                        <AvatarFallback>{convo.name.substring(0,2)}</AvatarFallback>
                                        {convo.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />}
                                    </Avatar>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="font-semibold truncate">{convo.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{convo.time}</span>
                                </div>
                            ))}
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
                        {/* Chat Header */}
                        <div className="flex items-center gap-4 p-4 border-b">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} data-ai-hint={selectedConversation.hint} />
                                <AvatarFallback>{selectedConversation.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{selectedConversation.name}</p>
                                {selectedConversation.online && <p className="text-xs text-green-500">Online</p>}
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-grow p-4">
                            <div className="space-y-4">
                                {messages.map((msg: any, index: number) => (
                                     <div key={index} className={`flex items-end gap-2 ${msg.me ? 'justify-end' : ''}`}>
                                        {!msg.me && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} data-ai-hint={selectedConversation.hint} />
                                                <AvatarFallback>{selectedConversation.name.substring(0,2)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${msg.me ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.me ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>{msg.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Chat Input */}
                        <div className="p-4 border-t bg-background/80">
                            <div className="relative">
                                <Input placeholder="Type a message..." className="pr-24" />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                     <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                 <Button variant="ghost" size="icon"><Camera className="w-5 h-5"/></Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Use Camera</p></TooltipContent>
                                        </Tooltip>
                                         <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon"><Paperclip className="w-5 h-5"/></Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Attach File</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <Button size="icon" className="ml-2 w-10 h-8 rounded-full">
                                        <Send className="w-5 h-5"/>
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </div>
                            </div>
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
