"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { EventCard } from "@/components/events/EventCard";
import { Sparkles, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchMyEvents = async () => {
      try {
        const { data } = await api.get("/events/enrolled");
        setEvents(data.data);
      } catch (error) {
        console.error("Failed to fetch enrolled events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-foreground">My Enrolled Events</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Events you have successfully registered for.
          </p>
        </motion.div>

        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl text-center"
          >
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Enrolled Events Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't signed up for any upcoming events. Explore the dashboard to find something interesting!
            </p>
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
            >
              Discover Events
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
