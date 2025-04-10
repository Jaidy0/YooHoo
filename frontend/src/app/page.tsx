'use client';
// import styles from './page.module.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  // 클라이언트 측에서만 MSW 초기화
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks').then((module) => module.default());
    }
  }, []);
  const router = useRouter();
  // const isAdmin = false; // 추후 로그인 상태에 따라 변경

  useEffect(() => {
    router.push('/yoohoo');
  }, [router]);

  return null; // 또는 로딩 상태 표시
}
