import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details",
};

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
