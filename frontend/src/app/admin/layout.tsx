'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import styles from './layout.module.scss';
// import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
// import HomeIcon from '@/assets/imgs/icons/iconHome.svg';

// 관리자 상단 네비게이션 항목 정의
const adminNavItems = [
  { name: '단체 정보 관리', link: '/admin/dogs' },
  { name: '후원금 관리', link: '/admin/donations' },
  { name: '강아지 관리', link: '/admin/users' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <header className={styles.adminHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <Link href='/admin'>
              <div className={styles.logoImage}>
                <Image
                  width={80}
                  height={80}
                  src='/images/yoohoo-logo.svg'
                  alt='유후 로고'
                  className={styles.logo}
                />
              </div>
              <span className={styles.logoText}>
                단체명 <strong>사용자명</strong> 님 환영합니다!
              </span>
            </Link>
          </div>
        </div>

        <div className={styles.mainNav}>
          <TabMenu menuItems={adminNavItems} className={styles.adminTabMenu} />
          {/* TO DO : svg 해결하기 */}
          {/* <MoveButton
            className={styles.smallButton}
            leftIcon={<HomeIcon width={16} height={16} />} // SVG를 React 컴포넌트로 직접 사용
            onClick={() => console.log('홈으로 이동')}
          >
            메인 화면으로 가기
          </MoveButton> */}
        </div>
      </header>

      <main className={styles.mainContent}>{children}</main>

      <footer className={styles.adminFooter}>
        <div className={styles.footerContent}>
          <p>
            &copy; {new Date().getFullYear()} 유기견 후원 시스템 | 관리자 페이지
          </p>
        </div>
      </footer>
    </div>
  );
}
