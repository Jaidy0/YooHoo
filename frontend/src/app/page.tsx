'use client';
// import styles from './page.module.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  // const isAdmin = false; // 추후 로그인 상태에 따라 변경

  useEffect(() => {
    // 추후 로그인 상태와 권한에 따라 분기 처리
    // if (isAdmin) {
    //   router.push('/admin');
    // } else {
    router.push('/main');
    // }
  }, [router]);

  return null; // 또는 로딩 상태 표시
}
