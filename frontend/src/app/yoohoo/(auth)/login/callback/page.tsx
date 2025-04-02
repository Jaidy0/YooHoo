// app/yoohoo/(auth)/login/kakao/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './page.module.scss';
import Image from 'next/image';

function KakaoLoginCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuthStatus, user, isLoading, error } = useAuthStore();
  const [showAdminOptions, setShowAdminOptions] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      try {
        // 개발 환경에서 로그인 성공 시 localStorage 설정
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('isLoggedIn', 'true');
          console.log('개발 환경: 로그인 상태 저장됨');
        }

        // URL에서 인증 코드 가져오기
        // const code = searchParams.get('code');

        // if (!code) {
        //   console.error('인증 코드가 없습니다.');
        //   router.push('/yoohoo/login/kakao');
        //   return;
        // }
        // console.log('###');
        // MSW가 처리할 카카오 로그인 API 호출
        // const response = await fetch(
        //   `${process.env.NEXT_PUBLIC_API_URL}/api/auth/kakao-login?code=${code}`,
        //   {
        //     credentials: 'include', // 쿠키 포함
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   }
        // );

        // console.log('response', response);
        // if (!response.ok) {
        //   throw new Error('로그인 처리 중 오류가 발생했습니다.');
        // }

        // 인증 상태 확인
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          console.error('인증 실패');
          router.push('/yoohoo/login/kakao');
          return;
        }

        // 사용자 타입에 따른 처리
        if (user?.is_admin) {
          setShowAdminOptions(true);
        } else {
          router.push('/yoohoo');
        }
      } catch (error) {
        console.error('인증 처리 중 오류:', error);
        router.push('/yoohoo/login/kakao');
      }
    }

    verifyAuth();
  }, [checkAuthStatus, router, user, searchParams]);

  // 관리자 옵션 선택 핸들러
  function handleAdminChoice(destination: 'main' | 'admin') {
    router.push(destination === 'main' ? '/yoohoo' : '/admin');
  }

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

  // 관리자용 선택 화면
  if (showAdminOptions) {
    return (
      <div className={styles.adminChoiceContainer}>
        <div className={styles.questionContainer}>
          <h2>
            <span className={styles.hi}>안녕하세요! 관리자님,</span>어디로
            이동할까요?
          </h2>
          <div className={styles.buttonContainer}>
            <button onClick={() => handleAdminChoice('main')}>
              <Image
                src='/images/shiba.png'
                alt='home'
                width={50}
                height={50}
              />
              <span>메인</span>
            </button>
            <button onClick={() => handleAdminChoice('admin')}>
              <Image
                src='/images/shiba.png'
                alt='home'
                width={50}
                height={50}
              />
              <span>관리자</span>
            </button>
          </div>
        </div>
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
