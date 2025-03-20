import { ReactNode } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: '유기견 후원 관리자 페이지',
  description: '유기견 후원 서비스 관리자 대시보드',
};

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
                {/* To Do: Image 태그로 수정 */}
                {/* <img src='/logo.png' alt='유후 로고' /> */}
              </div>
              <span className={styles.logoText}>
                단체명 <strong>사용자명</strong> 님 환영합니다!
              </span>
            </Link>
          </div>
        </div>

        <div className={styles.mainNav}>
          <TabMenu menuItems={adminNavItems} className={styles.adminTabMenu} />
          {/* TO DO: 버튼으로 수정 */}
          <Link href='/admin/guide' className={styles.guideButton}>
            <span>메인 페이지가기</span>
          </Link>
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
