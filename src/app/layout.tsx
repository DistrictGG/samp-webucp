import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner"


export const metadata: Metadata = {
  title: "District Roleplay",
  keywords: ["District Roleplay", "GTA SA", "Samp", "Roleplay"],
  description: "District Roleplay is a community for Grand Theft Auto San Andreas Multiplayer (SAMP) enthusiasts, offering a unique roleplaying experience.",
  authors: [{ name: "DistrictGG"}],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster position="top-right"/>
            </ThemeProvider>
          </TRPCReactProvider>
      </body>
    </html>
  );
}
