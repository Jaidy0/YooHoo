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
import { useShelterStore } from '@/store/shelterStore';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard/AdminAuthGuard';

// 관리자 상단 네비게이션 항목 정의
const adminNavItems = [
  { name: '단체 정보 관리', link: '/admin' },
  { name: '후원금 관리', link: '/admin/donations' },
  { name: '강아지 관리', link: '/admin/dogs' },
];

// 모바일 디바이스 최소 너비 (이 너비보다 작으면 경고창 표시)
const MIN_DESKTOP_WIDTH = 768; // 태블릿 크기 이하를 모바일로 간주

export default function AdminLayout({ children }: { children: ReactNode }) {
  console.log('Admin Layout 함수 컴포넌트 실행');

  const pathname = usePathname();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [, setIsMobileView] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  // Auth 스토어에서 사용자 정보 가져오기
  const { user, checkAuthStatus } = useAuthStore();

  // Shelter 스토어에서 쉘터 정보와 함수 가져오기
  const { shelter, fetchShelterData } = useShelterStore();

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    async function checkAuth() {
      console.log('AdminLayout: 인증 상태 확인 중');
      try {
        const result = await checkAuthStatus();
        console.log('AdminLayout: 인증 상태 확인 결과', result);
      } catch (error) {
        console.error('AdminLayout: 인증 상태 확인 실패', error);
      }
    }

    checkAuth();
  }, [checkAuthStatus]);

  // 사용자 정보가 변경될 때마다 shelter 정보 가져오기
  useEffect(() => {
    async function loadShelterData() {
      if (user?.shelterId) {
        console.log(
          'AdminLayout: 쉘터 정보 로드 시작, shelterId:',
          user.shelterId
        );
        try {
          const result = await fetchShelterData(user.shelterId);
          console.log('AdminLayout: 쉘터 정보 로드 결과', result);
        } catch (error) {
          console.error('AdminLayout: 쉘터 정보 로드 실패', error);
        }
      }
    }

    loadShelterData();
  }, [user, fetchShelterData]);

  // 화면 크기 감지 및 경고창 처리
  useEffect(() => {
    // 초기 화면 크기 확인
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < MIN_DESKTOP_WIDTH;
      setIsMobileView(isMobile);

      // 모바일 화면에서만 경고창 표시
      if (isMobile) {
        setShowMobileWarning(true);
      } else {
        setShowMobileWarning(false);
      }
    };

    // 첫 로드 시 체크
    checkScreenSize();

    // 화면 크기 변경 시 체크
    window.addEventListener('resize', checkScreenSize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  console.log('AdminLayout: 쉘터 정보:', shelter);

  // shelterId를 user 객체에서 가져옴
  const shelterIdFromUser = user?.shelterId || 1;

  // 경로에 따른 탭 인덱스 업데이트
  useEffect(() => {
    if (pathname === '/admin') {
      setActiveTabIndex(0);
    } else if (pathname?.startsWith('/admin/donations')) {
      setActiveTabIndex(1);
    } else if (pathname?.startsWith('/admin/dogs')) {
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

  // 경고창 닫기 핸들러
  const handleCloseWarning = () => {
    setShowMobileWarning(false);
  };

  // AdminAuthGuard로 감싸서 인증 및 관리자 권한 확인
  return (
    <AdminAuthGuard shelterId={shelterIdFromUser}>
      {showMobileWarning && (
        <div className={styles.mobileWarning}>
          <div className={styles.warningContent}>
            <IconBox name='bell' size={24} />
            <p>관리자 페이지는 웹으로 이용해주시기 바랍니다.</p>
            <p>화면 크기가 작아 일부 기능이 제한될 수 있습니다.</p>
            <button
              className={styles.warningCloseBtn}
              onClick={handleCloseWarning}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <div className={styles.adminLayout}>
        <header className={styles.adminHeader}>
          <div className={styles.headerContainer}>
            <div className={styles.logo}>
              <Link href='/admin'>
                <div className={styles.logoImage}>
                  <Image
                    width={50}
                    height={50}
                    src='/images/yoohoo-logo.svg'
                    alt='유후 로고'
                    className={styles.logo}
                  />
                </div>
                <span className={styles.logoText}>
                  {shelter?.name || '단체명'}{' '}
                  <strong>{user?.nickname || '사용자명'}</strong> 님 환영합니다!
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
