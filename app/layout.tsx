import './globals.css';
import type { Metadata } from 'next';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'VERTIKAL',
  description: 'The future of vertical storytelling.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <div className="pb-20">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}


