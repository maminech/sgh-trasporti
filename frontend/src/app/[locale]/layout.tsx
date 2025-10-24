import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'SGH Trasporti - Professional Transport & Logistics',
  description: 'Complete transport and logistics solutions for your business needs. Real-time tracking, reliable service, modern fleet.',
  keywords: 'transport, logistics, freight, shipping, tracking, SGH',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          {/* Chatbot Widget - Available on all pages */}
          <ChatbotWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
