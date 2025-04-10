'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import styles from './LogoutButton.module.scss';
import IconBox from '../common/IconBox/IconBox';

export default function LogoutButton() {
  // Hooks를 컴포넌트 최상단에 선언
  const { logout } = useAuthStore();
  const router = useRouter();

  // 이벤트 핸들러를 useCallback으로 메모이제이션
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push('/yoohoo');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }, [logout, router]); // 의존성 배열 추가

  return (
    <button className={styles.logoutBtn} onClick={handleLogout}>
      <IconBox size={16} name='logout' />
    </button>
  );
}
