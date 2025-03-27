import { ReactNode } from 'react';
import styles from './layout.module.scss';
import '@/assets/styles/globals.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '유후',
  description: '즐겁고 투명한 유기견 후원',
  icons: {
    // 기본 favicon
    icon: '/favicon.ico',
    // Apple 기기용 아이콘
    apple: '/apple-icon.png',
    // PWA용 아이콘들
    shortcut: ['/favicon.ico'],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icon.png',
      },
    ],
  },
  // PWA 매니페스트
  manifest: '/manifest.json',
  // 뷰포트 설정
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  // 모바일 웹앱 설정
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '유후',
  },
};

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <head></head>
      <body className={styles.body}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
