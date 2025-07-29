// layout.tsx
import { ReactNode } from 'react';
import styles from './layout.module.scss';
import '@/assets/styles/globals.scss';
import { Metadata } from 'next';
import ClientMswInitializer from '@/components/ClientMswInitializer/ClientMswInitializer';
import QueryProvider from '@/components/Providers/QueryProvider';

export const metadata: Metadata = {
  title: '유후',
  description: '손쉽고 편리한 유기견 후원🐶',
  themeColor: '#fee101',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
    shortcut: ['/favicon.ico'],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icon512_rounded.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icon512_rounded.png',
      },
      {
        rel: 'mask-icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icon512_maskable.png',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: '유후',
    statusBarStyle: 'black-translucent', // 또는 'default'
  },
};

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <head></head>
      <body className={styles.body} suppressHydrationWarning>
        <QueryProvider>
          {process.env.NODE_ENV === 'development' && <ClientMswInitializer />}
          <main className={styles.main}>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
