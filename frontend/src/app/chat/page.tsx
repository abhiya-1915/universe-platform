"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Send, Hash, Users, Sparkles, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import api from "@/lib/api";

const PREDEFINED_CHATS = [
  {
    id: "campus-general",
    name: "Campus General",
    icon: <Users className="w-5 h-5" />,
    description: "Hangout and talk with everyone on campus."
  },
  {
    id: "tech-club",
    name: "Tech Club",
    icon: <Hash className="w-5 h-5" />,
    description: "Discussing coding, startups, and tech news."
  }
];

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  
  const [activeChat, setActiveChat] = useState(PREDEFINED_CHATS[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Fetch messages when room changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/chat/${activeChat.id}`);
        if (res.data.success) {
          setMessages(res.data.data.map((msg: any) => ({
            ...msg,
            isMe: msg.senderId === user.id,
            time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [activeChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const tempMessage = {
      id: Date.now(),
      sender: user.name,
      text: newMessage,
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistic update
    setMessages([...messages, tempMessage]);
    const messageContent = newMessage;
    setNewMessage("");

    try {
      await api.post(`/chat/${activeChat.id}`, { content: messageContent });
      // In a real app, you might fetch again or use the returned object, but optimistic is fine for now
    } catch (error) {
      console.error("Failed to send message", error);
      // Remove the temp message if failed
      setMessages(messages.filter(m => m.id !== tempMessage.id));
    }
  };

  const switchChat = (chatId: string) => {
    const chat = PREDEFINED_CHATS.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
    }
  };

  if (!user) return null;

  return (
    <main className="h-screen flex flex-col bg-neutral-950 text-neutral-50 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-neutral-800 bg-neutral-950/50 hidden md:flex flex-col">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" /> Channels
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {PREDEFINED_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => switchChat(chat.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeChat.id === chat.id 
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" 
                    : "hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {chat.icon}
                <span className="font-medium">{chat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-neutral-900/20 relative">
          {/* Chat Header */}
          <div className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                {activeChat.icon} {activeChat.name}
              </h3>
              <p className="text-xs text-neutral-400">{activeChat.description}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-2">
                <MessageCircle className="w-12 h-12 text-neutral-700" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex flex-col max-w-[75%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  {!msg.isMe && (
                    <span className="text-xs text-neutral-400 ml-2 mb-1">{msg.sender}</span>
                  )}
                  <div className={`p-4 rounded-2xl ${
                    msg.isMe 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' 
                      : 'bg-neutral-800 text-neutral-100 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 mx-1">{msg.time}</span>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message #${activeChat.name.toLowerCase().replace(' ', '-')}...`}
                className="bg-neutral-900 border-neutral-800 focus-visible:ring-purple-500 rounded-full px-6 flex-1"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
