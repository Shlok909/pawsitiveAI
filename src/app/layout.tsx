import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "Pawsight AI",
  description: "Decode your dog's silence. Understand their emotions and well-being through AI-powered analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
