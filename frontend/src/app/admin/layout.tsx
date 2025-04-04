//layout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import styles from './layout.module.scss';
import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
import IconBox from '@/components/common/IconBox/IconBox';
import { useAuthStore } from '@/store/authStore';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard/AdminAuthGuard';

// 관리자 상단 네비게이션 항목 정의
const adminNavItems = [
  { name: '단체 정보 관리', link: '/admin' },
  { name: '후원금 관리', link: '/admin/donations' },
  { name: '강아지 관리', link: '/admin/dogs' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  console.log('Admin Layout 함수 컴포넌트 실행');

  const pathname = usePathname();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { user } = useAuthStore();

  // shelterId를 user 객체에서 가져옴
  const shelterIdFromUser = user?.shelterId || 0;

  // 경로에 따른 탭 인덱스 업데이트
  useEffect(() => {
    if (pathname === '/admin') {
      setActiveTabIndex(0);
    } else if (pathname.startsWith('/admin/donations')) {
      setActiveTabIndex(1);
    } else if (pathname.startsWith('/admin/dogs')) {
      setActiveTabIndex(2);
    }
  }, [pathname]);

  // 탭 클릭 핸들러
  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTabIndex(index);
    if (item.link) {
      router.push(item.link);
    }
  };

  // AdminAuthGuard로 감싸서 인증 및 관리자 권한 확인
  return (
    <AdminAuthGuard shelterId={shelterIdFromUser}>
      <div className={styles.adminLayout}>
        <header className={styles.adminHeader}>
          <div className={styles.headerContainer}>
            <div className={styles.logo}>
              <Link href='/admin'>
                <div className={styles.logoImage}>
                  <Image
                    width={100}
                    height={100}
                    src='/images/yoohoo-logo.svg'
                    alt='유후 로고'
                    className={styles.logo}
                  />
                </div>
                <span className={styles.logoText}>
                  {'단체명'} <strong>{user?.nickname || '사용자명'}</strong> 님
                  환영합니다!
                </span>
              </Link>
            </div>
          </div>

          <div className={styles.mainNav}>
            <TabMenu
              size='lg'
              menuItems={adminNavItems}
              defaultActiveIndex={activeTabIndex}
              onMenuItemClick={handleTabClick}
            />
            <MoveButton
              leftIcon={<IconBox name='home' size={24} />}
              onClick={() => router.push('/yoohoo')}
            >
              메인 화면으로 가기
            </MoveButton>
          </div>
        </header>

        <main className={styles.mainContent}>{children}</main>

        <footer className={styles.adminFooter}>
          <div className={styles.footerContent}>
            <p>&copy; 2025 유기견 후원 시스템 | 관리자 페이지</p>
          </div>
        </footer>
      </div>
    </AdminAuthGuard>
  );
}
