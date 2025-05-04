import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import 'nprogress/nprogress.css'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "University Scheduler",
  description: "Sistem penjadwalan mata kuliah yang dibangun menggunakan next.js dan algoritma bactracking",
  icons: "/images/logo.png"
}

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
