// app/(main)/layout.tsx
'use client';

import Header from '@/components/layout/Header/Header';
import { ReactNode } from 'react';
import styles from './layout.module.scss';
import BottomNav, {
  BottomNavItem,
} from '@/components/layout/BottomNav/BottomNav';
import { usePathname } from 'next/navigation';
// import styles from './MainLayout.module.scss';

const navItems: BottomNavItem[] = [
  {
    label: '홈',
    iconName: 'home',
    href: '/main',
  },
  {
    label: '단체',
    iconName: 'dog',
    href: '/main/dogs',
  },
  {
    label: '후원',
    iconName: 'bone',
    href: '/main/donate',
  },
  {
    label: '마이페이지',
    iconName: 'petfoot',
    href: '/main/profile',
  },
];

export const PAGE_TITLES = {
  main: '유후',
  dogs: '보호소',
  donate: '후원하기',
  profile: '마이페이지',
  kakao: '카카오 로그인',
} as const;

export type PageKey = keyof typeof PAGE_TITLES;

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMainPage = pathname === '/main';

  // 경로에서 페이지 키 추출
  const pageKey = pathname.split('/').pop() as keyof typeof PAGE_TITLES;
  const pageTitle = pageKey ? PAGE_TITLES[pageKey] : PAGE_TITLES.main;

  return (
    <div className={styles.container}>
      <Header
        title={pageTitle}
        type={isMainPage ? 'main' : 'sub'}
        onBackClick={!isMainPage ? () => window.history.back() : undefined}
      />
      <main className={styles.main}>{children}</main>
      <BottomNav items={navItems} />
    </div>
  );
}
