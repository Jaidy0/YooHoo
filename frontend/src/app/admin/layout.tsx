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

// 관리자 상단 네비게이션 항목 정의
const adminNavItems = [
  { name: '단체 정보 관리', link: '/admin' },
  { name: '후원금 관리', link: '/admin/donations' },
  { name: '강아지 관리', link: '/admin/dogs' },
];
console.log('Admin Layout 렌더링 시작');

export default function AdminLayout({ children }: { children: ReactNode }) {
  console.log('Admin Layout 함수 컴포넌트 실행');

  const pathname = usePathname();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // 인증 상태 확인 - 타임아웃 방식으로 변경
  useEffect(() => {
    const initAuth = async () => {
      // 이미 인증되었거나 최대 재시도 횟수를 초과한 경우
      if (isAuthenticated || retryCount >= maxRetries) {
        return;
      }

      console.log(`인증 확인 시도 ${retryCount + 1}/${maxRetries}`);

      try {
        // 인증 상태 확인
        await checkAuthStatus();

        // 인증 상태가 변경되지 않았고 로딩 중인 경우 타임아웃 설정
        if (!isAuthenticated && isLoading) {
          const id = window.setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            // 로딩 중이 지속되면 강제로 로딩 상태 해제 (Store 수정 필요)
            if (retryCount >= maxRetries - 1) {
              // 임시 데이터로 계속 진행
              console.log('최대 재시도 횟수 도달, 임시 데이터로 진행');

              // 여기서 임시 사용자 데이터 설정 로직이 필요합니다
              // 예: setMockUser()
            }
          }, 3000); // 3초 후 재시도

          setTimeoutId(id);
          return () => {
            if (id) window.clearTimeout(id);
          };
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
        setRetryCount((prev) => prev + 1);
      }
    };

    initAuth();

    // 클린업 함수
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    checkAuthStatus,
    isAuthenticated,
    isLoading,
    retryCount,
    maxRetries,
    timeoutId,
  ]);

  console.log('인증 상태:', isAuthenticated);
  console.log('사용자 정보:', user);
  console.log('로딩 중:', isLoading);
  console.log('재시도 횟수:', retryCount);

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

  // 로딩 중이고 최대 재시도 횟수에 도달하지 않았을 때
  if ((isLoading || !isAuthenticated) && retryCount < maxRetries) {
    return (
      <div className={styles.adminLayout}>
        <div className='admin-loading'>
          <p>
            관리자 페이지 로딩 중... (시도 {retryCount + 1}/{maxRetries})
          </p>
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e0e0e0',
              marginTop: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((retryCount + 1) / maxRetries) * 100}%`,
                height: '100%',
                backgroundColor: '#3498db',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 최대 재시도 횟수에 도달했거나 오류가 발생한 경우
  if (retryCount >= maxRetries && !isAuthenticated) {
    return (
      <div className={styles.adminLayout}>
        <div className='admin-loading'>
          <p>페이지 로드 중 문제가 발생했습니다.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => {
                setRetryCount(0);
                checkAuthStatus();
              }}
              style={{
                padding: '10px 15px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
            <button
              onClick={() => router.push('/login?redirect=/admin')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 개발 목적으로 임시 사용자 데이터 설정
  if (retryCount >= maxRetries && !user) {
    // 임시 사용자 데이터로 진행 (개발 환경에서만 사용)
    return (
      <div className={styles.adminLayout}>
        <div className='admin-header'>
          <h1>관리자 페이지 (개발 모드)</h1>
          <p>인증 문제가 발생했습니다. 개발 모드로 진행합니다.</p>
        </div>
        <main className={styles.mainContent}>{children}</main>
      </div>
    );
  }

  // 정상적인 렌더링
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

      <main className={styles.mainContent}>
        <div
          className='notice'
          style={{
            padding: '15px',
            backgroundColor: 'rgba(255, 235, 156, 0.5)',
            border: '1px solid #f1c40f',
            borderRadius: '5px',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>알림:</strong> 인증 문제로 인해 일부 기능이 제한될 수
            있습니다.
          </p>
        </div>
        {children}
      </main>

      <footer className={styles.adminFooter}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 유기견 후원 시스템 | 관리자 페이지</p>
        </div>
      </footer>
    </div>
  );
}
