"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
}

export function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-neutral-900 border-neutral-800 hover:border-purple-500/50 transition-colors group flex flex-col h-full">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl text-neutral-50">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-neutral-400 text-sm line-clamp-3 mb-4">{event.description}</p>
          <div className="flex flex-col gap-2 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(event.date), "PPP p")}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/events/${event.id}`} className="w-full">
            <Button className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 group-hover:bg-purple-600 transition-colors">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
