"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { EventCard } from "@/components/events/EventCard";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [eventsRes, announcementsRes, recsRes] = await Promise.all([
          api.get("/events"),
          api.get("/announcements"),
          api.get("/events/recommendations/for-you").catch(() => ({ data: { data: [] } }))
        ]);
        setEvents(eventsRes.data.data);
        setAnnouncements(announcementsRes.data.data);
        setRecommendations(recsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              Dashboard <Sparkles className="text-purple-500 w-6 h-6" />
            </h1>
            <p className="text-neutral-400">Welcome back, {user.name}!</p>
          </div>
          
          {(user.role === 'ADMIN' || user.role === 'DSA') && (
            <Link href="/events/create">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" /> Create Event
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="space-y-12">
            {announcements.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" /> Campus News
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {announcements.map((ann: any) => (
                    <div key={ann.id} className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 border-l-4 border-l-blue-500">
                      <h3 className="text-lg font-bold mb-2 text-neutral-100">{ann.title}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {recommendations.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" /> ✨ Recommended for You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((event: any, index) => (
                    <EventCard key={`rec-${event.id}`} event={event} index={index} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.length > 0 ? (
                  events.map((event: any, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 text-neutral-500">
                    No events found. Check back later!
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
