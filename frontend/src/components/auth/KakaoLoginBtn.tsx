'use client';

// import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './KakaoLoginBtn.module.scss';
import { KAKAO_AUTH_URL } from '@/lib/constants/auth';
import IconBox from '../common/IconBox/IconBox';

// const KAKAO_AUTH_URL =
//   'https://kauth.kakao.com/oauth/authorize?client_id=0fd06d3411cbcfb4f97b0eb93baedd48&redirect_uri=http://localhost:8080/api/auth/kakao-login&response_type=code';

export default function KakaoLoginBtn() {
  return (
    <Link href={KAKAO_AUTH_URL}>
      <span className={styles.kakaoBtn}>
        <IconBox size={20} color='#000' name='kakao' />
        카카오 로그인
      </span>
    </Link>
  );
}
