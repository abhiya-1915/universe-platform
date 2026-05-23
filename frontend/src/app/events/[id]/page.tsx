"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { ChatBox } from "@/components/chat/ChatBox";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${eventId}`);
        setEvent(data.data);
        const registered = data.data.registrations?.some((r: any) => r.userId === user.id);
        setIsRegistered(registered);
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user, router]);

  const handleRegister = async () => {
    if (isRegistered) return;
    setRegistering(true);
    try {
      await api.post(`/events/${eventId}/register`);
      setIsRegistered(true);
    } catch (error) {
      console.error("Failed to register", error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 max-w-6xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-400 hover:text-purple-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 text-neutral-400">
                <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  {format(new Date(event.date), "PPP 'at' p")}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 text-neutral-200 border-b border-neutral-800 pb-2">About this event</h3>
              <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-8 text-center flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4">Join the experience</h3>
              {isRegistered ? (
                <div className="flex items-center text-green-400 bg-green-500/10 px-6 py-3 rounded-full border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  You're registered for this event
                </div>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleRegister} 
                  disabled={registering}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 w-full max-w-md rounded-full h-14 text-lg"
                >
                  {registering ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  Confirm RSVP
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <ChatBox eventId={event.id} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
