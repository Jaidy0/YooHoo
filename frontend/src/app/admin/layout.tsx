'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import styles from './layout.module.scss';
import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
import IconBox from '@/components/common/IconBox/IconBox';
// 관리자 상단 네비게이션 항목 정의
const adminNavItems = [
  { name: '단체 정보 관리', link: '/admin' },
  { name: '후원금 관리', link: '/admin/donations' },
  { name: '강아지 관리', link: '/admin/dogs' },
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
                  width={100}
                  height={100}
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
          <TabMenu size='lg' menuItems={adminNavItems} />
          <MoveButton leftIcon={<IconBox name='home' size={24} />}>
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
  );
}
