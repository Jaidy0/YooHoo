'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import styles from './layout.module.scss';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import Dashboard from '@/components/profile/Dashboard/Dashboard';

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  // 현재 경로 가져오기
  const pathname = usePathname();

  // 메뉴 아이템 정의
  const menuItems = [
    { name: '후원 내역', link: '/yoohoo/profile' },
    { name: '후원한 강아지', link: '/yoohoo/profile/donate-dogs' },
    { name: '후원증서', link: '/yoohoo/profile/certificates' },
    { name: '후원금 영수증', link: '/yoohoo/profile/receipts' },
  ];

  // 메인 프로필 페이지인지 확인 (/profile 또는 /profile/)
  const isMainProfilePage =
    pathname === '/yoohoo/profile' || pathname === '/yoohoo/profile/';

  return (
    <div className={styles.profileLayout}>
      {/* 대시보드는 메인 프로필 페이지에서만 표시 */}
      <div className={styles.dashboardContainer}>
      {isMainProfilePage && <Dashboard />}
      </div>

      {/* 탭 메뉴 */}
      <TabMenu
        menuItems={menuItems}
        fullWidth={true}
        className={styles.tabMenu}
      />

      {/* 페이지 컨텐츠 */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
