"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Zap } from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-neutral-950 to-neutral-950 -z-10" />
        
        <div className="container mx-auto text-center max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20 mb-6 inline-block">
              Welcome to the future of college events
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Connect. Engage. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                Experience UniVerse.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
              The ultimate platform for event registration, real-time networking, and campus announcements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 rounded-full">
                  Join Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-neutral-800 text-neutral-300 hover:bg-neutral-900">
                  Explore Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-neutral-950">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Calendar, title: "Seamless Registration", desc: "One-click RSVP for all your favorite campus events." },
              { icon: Zap, title: "Real-time Updates", desc: "Get instant notifications and live event countdowns." },
              { icon: Users, title: "Live Chat & Networking", desc: "Connect with attendees instantly during the event." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={item} className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
