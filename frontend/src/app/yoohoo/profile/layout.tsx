'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import Dashboard from '@/components/profile/Dashboard/Dashboard';
import styles from './layout.module.scss';
import AuthInitializer from '@/components/auth/AuthGuard/AuthInitializer';

// 프로필 네비게이션 항목 정의
const profileTabs: TabMenuItem[] = [
  { name: '후원 내역', link: '/yoohoo/profile' },
  { name: '후원한 강아지', link: '/yoohoo/profile/donate-dogs' },
  { name: '후원증서', link: '/yoohoo/profile/certificates' },
  { name: '후원금 영수증', link: '/yoohoo/profile/receipts' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // 경로가 변경될 때마다 활성 탭 인덱스 업데이트
  useEffect(() => {
    // 경로에 따라 활성 탭 인덱스 결정
    if (
      pathname === '/yoohoo/profile' ||
      pathname === '/yoohoo/profile/' ||
      pathname === '/yoohoo/profile/donation-report' // 후원 레포트 페이지도 '후원 내역' 탭으로 처리
    ) {
      setActiveTabIndex(0);
    } else if (pathname?.startsWith('/yoohoo/profile/donate-dogs')) {
      setActiveTabIndex(1);
    } else if (pathname?.startsWith('/yoohoo/profile/certificates')) {
      setActiveTabIndex(2);
    } else if (pathname?.startsWith('/yoohoo/profile/receipts')) {
      setActiveTabIndex(3);
    }
  }, [pathname]);

  // 탭 클릭 시 상태 업데이트 및 페이지 이동
  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTabIndex(index);
    if (item.link) {
      // link가 존재할 때만 router.push 실행
      router.push(item.link);
    }
  };

  const isMainPage =
    pathname === '/yoohoo/profile' || pathname === '/yoohoo/profile/';

  return (
    <div className={styles.profileLayout}>
      <AuthInitializer />

      <div className={styles.dashboardContainer}>
        {isMainPage && <Dashboard />}
      </div>

      <div className={styles.tabMenuWrapper}>
        <TabMenu
          menuItems={profileTabs}
          activeIndex={activeTabIndex}
          onMenuItemClick={handleTabClick}
          size='sm'
          fullWidth={true}
        />
      </div>

      <main className={styles.pageContent}>{children}</main>
    </div>
  );
}
