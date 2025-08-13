
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | CalcuMaster SS',
    default: 'CalcuMaster SS - Your All-in-One Online Calculator',
  },
  description: 'The ultimate free online calculator suite. CalcuMaster SS offers a comprehensive collection of tools for basic arithmetic, scientific functions, financial planning, health metrics, and more. Fast, user-friendly, and ad-free.',
  keywords: [
    'online calculator',
    'free calculator',
    'scientific calculator',
    'financial calculator',
    'bmi calculator',
    'loan calculator',
    'interest calculator',
    'math solver',
    'unit converter',
    'percentage calculator',
    'gpa calculator',
    'all-in-one calculator',
  ],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head />
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
