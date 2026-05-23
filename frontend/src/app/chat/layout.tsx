import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat - UniVerse",
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
