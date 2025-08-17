

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { GlobalHeader } from "@/components/jummix/GlobalHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Jummix",
  description: "Your social event hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased h-full`}>
        <AuthProvider>
            <GlobalHeader />
            {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
