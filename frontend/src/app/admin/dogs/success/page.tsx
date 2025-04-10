'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';
import DonateComplete from '@/components/donations/DonateComplete';
import { useEffect, useState } from 'react';

export default function DogRegisterSuccessPage() {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 애니메이션 효과를 위해 상태 변경
    setAnimateIn(true);
  }, []);

  return (
    <div className={styles.successPage}>
      {/* 왼쪽 상단 로고 */}
      <Link href='/admin' className={styles.logoWrapper}>
        <Image
          src='/images/admin-logo.svg'
          alt='관리자 로고'
          width={120}
          height={40}
          className={styles.logo}
        />
      </Link>

      {/* 콘텐츠 박스 */}
      <div
        className={`${styles.contentBox} ${animateIn ? styles.animateIn : ''}`}
      >
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>강아지 등록 완료</h1>
          <Image
            src='/images/donatePaw.svg'
            alt='발자국'
            width={28}
            height={28}
            className={styles.pawPrint}
          />
        </div>
        <p className={styles.subtitle}>
          새로운 강아지 정보가 성공적으로 등록되었어요!
        </p>

        {/* 성공 이미지와 배경 */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageBackground}>
            <DonateComplete />
            <div className={styles.shadow}></div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <Link href='/admin/dogs'>
            <Button variant='outline'>목록으로</Button>
          </Link>
          <Link href='/admin/dogs/register'>
            <Button variant='primary'>다른 강아지 등록하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
