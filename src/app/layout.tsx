import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inkwell — Your Daily Journal",
  description: "A beautiful place to write, reflect, and grow. Track your mood, build writing streaks, and explore your thoughts every day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
