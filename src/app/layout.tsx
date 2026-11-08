import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beyond — Meet beyond your circle",
  description: "Real-world social discovery network in Guwahati. Join small-group hosted experiences at neighborhood cafes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
