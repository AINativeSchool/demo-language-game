import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import OnboardingTour from "@/components/OnboardingTour";

export const metadata: Metadata = {
  title: "LINGOCRAFT",
  description:
    "Craft your English! Chat with characters, mine gems, and build your skill on the block world map.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <OnboardingTour />
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-6 pt-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
