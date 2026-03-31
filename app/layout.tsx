import localFont from 'next/font/local';

import { Providers } from '@/src/app/provider';

import './styles/globals.css';
import { Figtree } from "next/font/google";
import { cn } from "@/src/shared/lib/cn";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

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
    <html lang='ko' className={cn("font-sans", figtree.variable)}>
      <head />
      <body className={`${pretendard.variable} antialiased`} >
          <Providers>
            <div className="max-w-120 mx-auto">
                {children}
            </div>
          </Providers>
      </body>
    </html>
  );
}
