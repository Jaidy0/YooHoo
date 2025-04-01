import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useAuthGuard(redirectPath: string = '/yoohoo/login/kakao') {
  const router = useRouter();
  const { isAuthenticated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    async function verifyAuth() {
      const isAuth = await checkAuthStatus();
      if (!isAuth) {
        router.push(redirectPath);
      }
    }
    verifyAuth();
  }, [checkAuthStatus, router, redirectPath]);

  return isAuthenticated;
}
