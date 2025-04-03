// app/yoohoo/(auth)/login/kakao/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './page.module.scss';

function KakaoLoginCallbackPage() {
  const router = useRouter();
  const { checkAuthStatus, isLoading, error } = useAuthStore();

  useEffect(() => {
    async function verifyAuth() {
      try {
        // 1. 개발 환경 설정
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('isLoggedIn', 'true');
          console.log('개발 환경: 로그인 상태 저장됨');
        }

        // 2. 인증 상태 확인
        const authResult = await checkAuthStatus();
        console.log('인증 결과:', authResult);

        // 3. 상태 업데이트 완료 대기
        await new Promise((resolve) => setTimeout(resolve, 0));

        // 4. 최종 상태 확인
        const { isAuthenticated, isAdmin } = authResult;

        if (!isAuthenticated) {
          console.error('인증 실패');
          router.push('/yoohoo/login/kakao');
          return;
        }

        // 5. 사용자 타입에 따른 처리
        if (isAdmin) {
          console.log('관리자로 판단됨');
          router.push('/yoohoo/login/choice');
        } else {
          console.log('일반 사용자로 판단됨');
          router.push('/yoohoo');
        }
      } catch (error) {
        console.error('인증 처리 중 오류:', error);
        router.push('/yoohoo/login/kakao');
      }
    }

    verifyAuth();
  }, [checkAuthStatus, router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>로그인 중입니다.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>로그인 중 오류가 발생했습니다</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/yoohoo/login/kakao')}>
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>로그인 중입니다.</p>
    </div>
  );
}

export default KakaoLoginCallbackPage;
