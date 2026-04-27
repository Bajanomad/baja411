import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ConditionalFooter from "@/components/ConditionalFooter";
import { LocationProvider } from "@/components/LocationProvider";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LocationProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </LocationProvider>
      </body>
    </html>
  );
}
