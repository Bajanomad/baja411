import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ConditionalFooter from "@/components/ConditionalFooter";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Baja 411",
    template: "%s | Baja 411",
  },
  description:
    "Your free guide to life in Baja California Sur — weather, hurricane tracking, local events, interactive map, classifieds, and business directory for the Baja corridor.",
  keywords: [
    "Baja California",
    "La Paz",
    "Todos Santos",
    "Cabo",
    "Pescadero",
    "weather",
    "hurricane",
    "expat",
    "travel",
    "boondocking",
  ],
  openGraph: {
    title: "Baja 411",
    description: "Your free guide to life in Baja California Sur.",
    url: "https://baja411.com",
    siteName: "Baja 411",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baja 411",
    description: "Your free guide to life in Baja California Sur.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
