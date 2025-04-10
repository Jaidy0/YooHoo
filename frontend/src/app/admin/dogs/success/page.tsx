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
      {/* 전체 화면에 퍼지는 빵빠레 애니메이션 배경 */}
      <div className={styles.confettiBackground}>
        <DonateComplete />
      </div>

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
            {/* 강아지 이미지 */}
            <div className={styles.dogImageContainer}>
              <Image
                src='/images/dog_complete.png'
                alt='강아지'
                width={200}
                height={200}
                className={styles.dogImage}
              />
            </div>
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
