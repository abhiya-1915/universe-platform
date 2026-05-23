"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          <Sparkles className="w-6 h-6 text-purple-500" />
          UniVerse
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-purple-400">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
