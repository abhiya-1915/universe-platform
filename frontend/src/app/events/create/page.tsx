"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date and time are required"),
  location: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "DSA")) {
    router.push("/dashboard");
    return null;
  }

  const onSubmit = async (data: EventFormValues) => {
    setError("");
    try {
      // The backend expects standard ISO strings or valid Date strings.
      // <input type="datetime-local"> gives YYYY-MM-DDTHH:mm, which JS Date parses fine.
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
      };
      
      const res = await api.post("/events", payload);
      if (res.data.success) {
        router.push(`/events/${res.data.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 max-w-2xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-400 hover:text-purple-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-3xl">Create New Event</CardTitle>
              <CardDescription className="text-neutral-400">
                Publish a new event to the campus feed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Tech Symposium 2026" 
                    className="bg-neutral-950 border-neutral-800 focus-visible:ring-purple-500"
                    {...register("title")}
                  />
                  {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    placeholder="Describe your event in detail..." 
                    className="flex min-h-[120px] w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("description")}
                  />
                  {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date & Time</Label>
                    <Input 
                      id="date" 
                      type="datetime-local"
                      className="bg-neutral-950 border-neutral-800 focus-visible:ring-purple-500"
                      {...register("date")}
                    />
                    {errors.date && <p className="text-sm text-red-400">{errors.date.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g., Main Auditorium" 
                      className="bg-neutral-950 border-neutral-800 focus-visible:ring-purple-500"
                      {...register("location")}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 h-12 text-lg"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  Publish Event
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
