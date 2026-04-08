import { Figtree } from 'next/font/google';
import localFont from 'next/font/local';

import { Providers } from '@/src/app/provider';
import { cn } from '@/src/shared/lib/cn';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import './styles/globals.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
});

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cn('font-sans', figtree.variable)}>
      <head />
      <body
        className={`${pretendard.variable} antialiased`}
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <Providers>
            <div className="bg-card mx-auto min-h-screen max-w-120 shadow-xl">
              {children}
            </div>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
