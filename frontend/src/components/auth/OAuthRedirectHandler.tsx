'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';

export default function OAuthRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { kakaoLogin } = useAuthStore();

  // 인가코드
  const code = searchParams.get('code');

  useEffect(() => {
    const handleAuth = async () => {
      if (!code) {
        router.push('/main/login');
        return;
      }

      try {
        await kakaoLogin(code);
        router.push('/main'); // 로그인 성공 시 메인 페이지로 이동
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        router.push('/main/login'); // 실패 시 로그인 페이지로 이동
      }
    };

    handleAuth();
  }, [code, kakaoLogin, router]);

  return (
    <div>
      <LoadingSpinner />
    </div>
  );
}
