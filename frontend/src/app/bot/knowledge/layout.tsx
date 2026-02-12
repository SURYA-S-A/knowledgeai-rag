import "../../globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { AppThemeProvider } from "@/components/theme/AppThemeProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Jarvis - Knowledge Bot",
    description: "Knowledge Bot - AI Chatbot with Document Understanding",
};

export default function KnowledgeChatBotLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning
            style={{
                "--primary-color": "#8b5cf6",
                "--secondary-color": "#7c3aed"
            } as React.CSSProperties}
        >
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AppThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </AppThemeProvider>
            </body>
        </html>
    );
}