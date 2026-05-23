"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    username: string | null;
  };
  createdAt: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'mock-1',
    content: "Hey everyone! Really excited for this event! 🎉",
    sender: { name: 'Alex Johnson', username: null },
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-2',
    content: "Same here! Do we need to bring our laptops?",
    sender: { name: 'Sarah Miller', username: null },
    createdAt: new Date().toISOString()
  }
];

export function ChatBox({ eventId }: { eventId: string }) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const { token, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
      path: "/socket.io",
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("join_event_chat", eventId);
    });

    socket.on("new_message", (message: Message & { eventId: string }) => {
      if (message.eventId === eventId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, token]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.emit("send_message", { eventId, content: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-neutral-800 bg-neutral-950/50">
        <h3 className="font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Event Chat
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
            No messages yet. Be the first to say hi!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender.name === user?.name ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-neutral-400 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> {msg.sender.name}
              </span>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender.name === user?.name ? 'bg-purple-600 text-white rounded-br-none' : 'bg-neutral-800 text-neutral-100 rounded-bl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-neutral-800 bg-neutral-950 flex gap-2">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="bg-neutral-900 border-neutral-800 focus-visible:ring-purple-500"
        />
        <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700 shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
