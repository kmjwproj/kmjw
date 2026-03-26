import localFont from 'next/font/local';

import { Providers } from '@/src/app/provider';

import '../globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
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
    <html lang='ko'>
      <head />
      <body className={`${pretendard.variable} antialiased`}>
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}
