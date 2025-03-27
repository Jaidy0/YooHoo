import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// useSearchParams를 사용하는 컴포넌트는 별도로 분리
export default function OAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 이 부분이 Suspense 내부의 컴포넌트에 있어야 함
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
        router.push('/main');
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        router.push('/main/login');
      }
    };

    handleAuth();
  }, [code, kakaoLogin, router]);

  return <LoadingSpinner />;
}
