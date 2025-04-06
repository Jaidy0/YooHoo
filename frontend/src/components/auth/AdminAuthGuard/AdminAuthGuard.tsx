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
  // 중복 인증 체크 방지를 위한 플래그
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  console.log('AdminAuthGuard 컴포넌트 실행, shelterId:', shelterId);
  console.log('AdminAuthGuard 사용자 정보:', user);
  console.log('AdminAuthGuard 인증 상태:', { isAuthenticated, isLoading });

  // shelterId 보정: undefined나 null이면 5로 설정
  const effectiveShelterId = shelterId || 5;

  // 인증 및 관리자 권한 확인 (단일 useEffect로 통합)
  useEffect(() => {
    // 이미 인증 체크 중이면 중복 실행 방지
    if (isCheckingAuth) return;

    // 이미 인증 체크가 완료되고 관리자 권한도 확인된 경우는 재확인 불필요
    if (authChecked && isAdmin === true) return;

    async function verifyAdminAuth() {
      setIsCheckingAuth(true);
      console.log('verifyAdminAuth 시작, 인증 상태:', {
        isAuthenticated,
        isLoading,
      });

      try {
        // 로딩 중이 아니고 인증되지 않은 경우에만 인증 상태 확인
        if (!isLoading && !isAuthenticated) {
          console.log('인증되지 않음, 인증 상태 확인 시도');

          try {
            const authResult = await checkAuthStatus();
            console.log('인증 상태 확인 결과:', authResult);

            if (!authResult.isAuthenticated) {
              console.log('인증되지 않음, 로그인 페이지로 리디렉션');
              router.push('/yoohoo/login/kakao?redirect=/admin');
              setIsCheckingAuth(false);
              return;
            }
          } catch (error) {
            console.error('인증 확인 중 오류:', error);
            router.push('/yoohoo/login/kakao?redirect=/admin');
            setIsCheckingAuth(false);
            return;
          }
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
              setIsCheckingAuth(false);
              return;
            }

            if (!authResult.isAdmin) {
              console.log('관리자 권한 없음, 메인 페이지로 리디렉션');
              router.push('/yoohoo');
              setIsCheckingAuth(false);
              return;
            }

            console.log('인증 및 관리자 권한 확인됨');
            setIsAdmin(true);
            setAuthChecked(true);
            setIsCheckingAuth(false);
            return;
          } catch (error) {
            console.error('인증 확인 중 오류:', error);
            router.push('/yoohoo/login/kakao?redirect=/admin');
            setIsCheckingAuth(false);
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
            setIsCheckingAuth(false);
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
            setIsCheckingAuth(false);
            return;
          }

          console.log('관리자 권한 확인됨');
          setIsAdmin(true);
          setAuthChecked(true);
        }
      } finally {
        setIsCheckingAuth(false);
      }
    }

    // 인증 상태 확인이 변경되었거나 로딩이 완료된 경우에만 권한 확인 실행
    if (!isLoading) {
      verifyAdminAuth();
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    router,
    checkAuthStatus,
    effectiveShelterId,
    authChecked,
    isAdmin,
    isCheckingAuth,
  ]);

  // 데이터 초기화 (인증 확인 후)
  // 중요: sessionStorage 접근을 최소화하기 위해 조건부로 훅 호출
  const { isInitialized, isSaving, error } = useAdminDataInitializer(
    isAdmin && user ? effectiveShelterId : 0
  );

  // 로딩 또는 권한 확인 중
  if (isLoading || !authChecked) {
    return (
      <div className='admin-loading'>
        <p>관리자 인증 확인 중...</p>
        <div className='loading-indicator'></div>

        {/* 서버에서도 표시될 디버깅 정보 */}
        <div style={{ fontSize: '12px', marginTop: '10px', color: '#777' }}>
          <div>인증 상태: {isAuthenticated ? '인증됨' : '인증안됨'}</div>
          <div>로딩 상태: {isLoading ? '로딩중' : '로딩완료'}</div>
          <div>권한 확인: {authChecked ? '완료' : '진행중'}</div>
          <div>인증 체크 중: {isCheckingAuth ? '진행중' : '아니오'}</div>
          <div>
            관리자 권한:{' '}
            {isAdmin === true ? '있음' : isAdmin === false ? '없음' : '확인중'}
          </div>
          <div>shelterId: {effectiveShelterId}</div>

          {/* 디버깅용 버튼 */}
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={() => {
                // 세션 초기화 대신 localStorage 사용
                localStorage.setItem('adminAuth', 'true');
                alert('관리자 인증 상태가 localStorage에 저장되었습니다.');
              }}
              style={{ marginRight: '10px', padding: '5px' }}
            >
              로컬 인증 상태 저장
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '5px' }}
            >
              페이지 새로고침
            </button>
          </div>
        </div>
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
            // 캐시 초기화를 localStorage 기반으로 변경
            localStorage.removeItem('adminData');
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
