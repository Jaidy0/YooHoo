'use client';

// import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './KakaoLoginBtn.module.scss';
import { KAKAO_AUTH_URL } from '@/lib/constants/auth';
import IconBox from '../common/IconBox/IconBox';

export default function KakaoLoginBtn() {
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    // 개발 환경에서는 MSW를 사용하므로, 실제 카카오 인증 대신 모킹된 콜백 URL로 이동
    if (process.env.NODE_ENV === 'development') {
      window.location.href = '/yoohoo/login/callback';
    } else {
      // 프로덕션 환경에서는 실제 카카오 로그인 URL로 이동
      window.location.href = KAKAO_AUTH_URL;
    }
  };

  return (
    <Link href='#' onClick={handleLogin}>
      <span className={styles.kakaoBtn}>
        <IconBox size={20} color='#000' name='kakao' />
        카카오 로그인
      </span>
    </Link>
  );
}
