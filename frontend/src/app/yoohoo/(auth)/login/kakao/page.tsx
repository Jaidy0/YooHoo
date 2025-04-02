'use client';

import KakaoLoginBtn from '@/components/auth/KakaoLoginBtn';
import Image from 'next/image';
import styles from './page.module.scss';
// import OAuthRedirectHandler from '@/components/auth/OAuthRedirectHandler';

export default function Login() {
  return (
    <div className={styles.container}>
      <Image
        width={200}
        height={100}
        src='/images/yoohoo-logo.svg'
        alt='유후 로고'
        className={styles.logo}
      />
      <KakaoLoginBtn />
    </div>
  );
}
