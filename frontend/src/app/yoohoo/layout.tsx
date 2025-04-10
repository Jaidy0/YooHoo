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
    href: '/yoohoo',
  },
  {
    label: '단체',
    iconName: 'dog',
    href: '/yoohoo/shelters',
  },
  {
    label: '후원',
    iconName: 'bone',
    href: '/yoohoo/donate',
  },
  {
    label: '마이페이지',
    iconName: 'petfoot',
    href: '/yoohoo/profile',
  },
];

const PAGE_TITLES = {
  main: '유후',
  dogs: '보호소',
  donate: '후원하기',
  profile: '마이페이지',
  kakao: '카카오 로그인',
} as const;

export type PageKey = keyof typeof PAGE_TITLES;

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMainPage = pathname === '/yoohoo';

  // 경로에서 페이지 키 추출
  // 페이지 키를 경로 기반으로 직접 판단
  let pageKey: PageKey = 'main';
  if (pathname.startsWith('/yoohoo/shelters')) {
    pageKey = 'dogs';
  } else if (pathname.startsWith('/yoohoo/profile')) {
    pageKey = 'profile';
  } else if (pathname.startsWith('/yoohoo/donate')) {
    pageKey = 'donate';
  } else if (pathname.startsWith('/yoohoo/login/kakao')) {
    pageKey = 'kakao';
  }

  const pageTitle = PAGE_TITLES[pageKey];

  // 제외할 페이지
  const hideHeaderForPaths = [
    '/yoohoo/login/callback',
    '/yoohoo/login/kakao',
    '/yoohoo/shelters',
    '/yoohoo/login/choice',
    '/yoohoo/donate/complete',
    '/yoohoo/login/error',
  ];
  const shouldHideHeader = pathname
    ? hideHeaderForPaths.includes(pathname)
    : false;
  const hideBottomNavForPaths = [
    '/yoohoo/donate/complete',
    '/yoohoo/login/callback',
    '/yoohoo/login/kakao',
    '/yoohoo/login/choice',
    '/yoohoo/login/error',
  ];
  const shouldHideBottomNav = pathname
    ? hideBottomNavForPaths.includes(pathname)
    : false;

  return (
    <div className={styles.container}>
      {!shouldHideHeader && (
        <Header
          title={pageTitle}
          type={isMainPage ? 'yoohoo' : 'sub'}
          onBackClick={!isMainPage ? () => window.history.back() : undefined}
        />
      )}
      <main
        className={`${styles.main} ${shouldHideBottomNav ? 'hide-bottom-nav' : ''}`}
      >
        {children}
      </main>

      {!shouldHideBottomNav && <BottomNav items={navItems} />}
    </div>
  );
}
