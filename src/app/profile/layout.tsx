import "~/styles/globals.css";
import { Geist } from "next/font/google";
import UCPProfile from "~/app/profile/components/profile";
import { SessionProvider } from "next-auth/react";
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
            <body>
                <SessionProvider>
                    <UCPProfile>
                        {children}
                    </UCPProfile>
                </SessionProvider>
            </body>
        </html>
    );
}
