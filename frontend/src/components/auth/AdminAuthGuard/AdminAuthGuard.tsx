//AdminAuthGuard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAdminDataInitializer } from '@/hooks/useAdminDataInitializer';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  shelterId: number;
}

console.log('AdminAuthGuard 파일 로드됨');

export default function AdminAuthGuard({
  children,
  shelterId,
}: AdminAuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  console.log('AdminAuthGuard 컴포넌트 실행, shelterId:', shelterId);
  console.log('AdminAuthGuard 사용자 정보:', user);
  console.log('AdminAuthGuard 인증 상태:', { isAuthenticated, isLoading });

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    async function initialAuthCheck() {
      if (!isAuthenticated && !isLoading) {
        console.log('AdminAuthGuard: 초기 인증 상태 확인');
        try {
          await checkAuthStatus();
        } catch (error) {
          console.error('AdminAuthGuard: 초기 인증 확인 실패', error);
        }
      }
    }

    initialAuthCheck();
  }, [isAuthenticated, isLoading, checkAuthStatus]);

  // shelterId 보정: undefined나 null이면 0으로 설정
  const effectiveShelterId = shelterId || 0;

  // 인증 및 관리자 권한 확인
  useEffect(() => {
    async function verifyAdminAuth() {
      console.log('verifyAdminAuth 시작, 인증 상태:', {
        isAuthenticated,
        isLoading,
      });

      // 로딩 중이 아니고 인증되지 않은 경우
      if (!isLoading && !isAuthenticated) {
        console.log('인증되지 않음, 로그인 페이지로 리디렉션');
        router.push('/yoohoo/login/kakao?redirect=/admin');
        return;
      }

      // 인증은 되었지만 사용자 정보가 없는 경우
      if (isAuthenticated && !user) {
        console.log('인증됨, 그러나 사용자 정보 없음. 인증 상태 재확인');

        try {
          // 인증 상태를 다시 확인하여 사용자 정보를 가져옴
          const authResult = await checkAuthStatus();
          console.log('인증 상태 재확인 결과:', authResult);

          if (!authResult.isAuthenticated) {
            console.log('인증 재확인 실패, 로그인 페이지로 리디렉션');
            router.push('/yoohoo/login/kakao?redirect=/admin');
            return;
          }

          if (!authResult.isAdmin) {
            console.log('관리자 권한 없음, 메인 페이지로 리디렉션');
            router.push('/yoohoo');
            return;
          }

          console.log('인증 및 관리자 권한 확인됨');
          setIsAdmin(true);
          setAuthChecked(true);
          return;
        } catch (error) {
          console.error('인증 확인 중 오류:', error);
          router.push('/yoohoo/login/kakao?redirect=/admin');
          return;
        }
      }

      // 인증되고 사용자 정보가 있는 경우
      if (isAuthenticated && user) {
        console.log('인증됨, 사용자 정보:', user);

        // 관리자 권한 확인
        const isAdminUser = user.isAdmin === true;

        if (!isAdminUser) {
          console.log('관리자 권한 없음, 메인 페이지로 리디렉션');
          router.push('/yoohoo');
          return;
        }

        // 보호소 ID 확인 (선택적)
        if (
          effectiveShelterId > 0 &&
          user.shelterId &&
          user.shelterId !== effectiveShelterId
        ) {
          console.log('보호소 ID 불일치, 권한 없음');
          router.push('/admin/unauthorized');
          return;
        }

        console.log('관리자 권한 확인됨');
        setIsAdmin(true);
      }

      setAuthChecked(true);
    }

    // 로딩이 끝났거나 인증 상태가 변경된 경우 실행
    if (!isLoading || isAuthenticated !== null) {
      verifyAdminAuth();
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    router,
    checkAuthStatus,
    effectiveShelterId,
  ]);

  // 데이터 초기화 (인증 확인 후)
  const { isInitialized, isSaving, error } = useAdminDataInitializer(
    isAdmin && user ? effectiveShelterId : 0
  );

  // 로딩 또는 권한 확인 중
  if (isLoading || !authChecked) {
    return (
      <div className='admin-loading'>
        <p>관리자 인증 확인 중...</p>
        <div className='loading-indicator'></div>
        {process.env.NODE_ENV === 'development' && (
          <div style={{ fontSize: '12px', marginTop: '10px', color: '#777' }}>
            <div>인증 상태: {isAuthenticated ? '인증됨' : '인증안됨'}</div>
            <div>로딩 상태: {isLoading ? '로딩중' : '로딩완료'}</div>
            <div>권한 확인: {authChecked ? '완료' : '진행중'}</div>
            <div>
              관리자 권한:{' '}
              {isAdmin === true
                ? '있음'
                : isAdmin === false
                  ? '없음'
                  : '확인중'}
            </div>
            <div>shelterId: {effectiveShelterId}</div>
            {user && <div>사용자: {JSON.stringify(user)}</div>}
          </div>
        )}
      </div>
    );
  }

  // 관리자 권한 없음
  if (!isAdmin) {
    return null; // 이미 useEffect에서 리디렉션 처리됨
  }

  console.log('관리자 권한 확인됨, 사용자 정보:', user);

  // 데이터 초기화 중
  if (!isInitialized || isSaving) {
    return (
      <div className='admin-loading'>
        <p>관리자 데이터 준비 중...</p>
        <div className='loading-indicator'></div>
      </div>
    );
  }

  // 데이터 초기화 오류
  if (error) {
    return (
      <div className='admin-error'>
        <p>데이터 초기화 오류:</p>
        <p>{error.message}</p>
        <div
          className='error-details'
          style={{ fontSize: '12px', marginBottom: '10px', color: '#777' }}
        >
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>개발자 정보</summary>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </details>
          )}
        </div>
        <button
          onClick={() => window.location.reload()}
          className='retry-button'
        >
          다시 시도
        </button>
        <button
          onClick={() => {
            // 세션 스토리지의 초기화 상태 제거
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              if (key && key.startsWith('adminDataInitialized_')) {
                sessionStorage.removeItem(key);
              }
            }
            window.location.reload();
          }}
          className='clear-button'
          style={{ marginLeft: '10px' }}
        >
          캐시 삭제 후 다시 시도
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
