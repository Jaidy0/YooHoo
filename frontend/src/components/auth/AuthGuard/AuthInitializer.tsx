'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().checkAuthStatus(); // 클라이언트 진입 시 상태 복원
  }, []);

  return null;
}
