import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import TransparentHeader from './components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HireHelp - Job Portal SaaS',
  description: 'Professional job portal for companies and candidates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <TransparentHeader />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}