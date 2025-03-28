// app/yoohoo/(auth)/login/kakao/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './page.module.scss';
import Image from 'next/image';

function KakaoLoginCallbackPage() {
  const router = useRouter();
  const { checkAuthStatus, user, isLoading, error } = useAuthStore();
  const [showAdminOptions, setShowAdminOptions] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      const isAuthenticated = await checkAuthStatus();

      if (!isAuthenticated) {
        alert('비로그인 상태입니다.다시 로그인 해주세요.');
        router.push('/yoohoo/login/kakao');
        return;
      }

      // 사용자 타입에 따른 처리
      if (user?.is_admin) {
        setShowAdminOptions(true);
      } else {
        // 일반 사용자는 메인 페이지로 리다이렉트
        // setShowAdminOptions(true);
        router.push('/yoohoo');
      }
    }

    verifyAuth();
  }, [checkAuthStatus, router, user]);

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
