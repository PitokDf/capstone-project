'use client'

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import 'nprogress/nprogress.css'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        <ThemeProvider enableSystem attribute="class" defaultTheme="system">
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
