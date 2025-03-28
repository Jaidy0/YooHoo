'use client';

import Link from 'next/link';
import styles from './page.module.scss';
import Image from 'next/image';
import ShelterCard from '@/components/shelters/ShelterCard/ShelterCard';
import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
// import { useRouter } from 'next/navigation';

const MOCK_SHELTERS = [
  {
    id: 1,
    imageUrl: '/images/dummy.jpeg',
    title: '행복한 멍멍이네',
    description: '서울시 마포구에 위치한 유기견 보호소입니다.',
    dogCount: 25,
    likeCount: 128,
  },
  {
    id: 2,
    imageUrl: '/images/dummy.jpeg',
    title: '사랑이 가득한 집',
    description: '10년째 유기견들과 함께하고 있는 보호소입니다.',
    dogCount: 18,
    likeCount: 95,
  },
  {
    id: 3,
    imageUrl: '/images/dummy.jpeg',
    title: '희망의 발자국',
    description: '경기도 파주의 유기견 보호 센터입니다.',
    dogCount: 32,
    likeCount: 156,
  },
  {
    id: 4,
    imageUrl: '/images/dummy.jpeg',
    title: '따뜻한 보금자리',
    description: '유기견 재활과 입양을 전문으로 하는 보호소입니다.',
    dogCount: 15,
    likeCount: 89,
  },
  {
    id: 5,
    imageUrl: '/images/dummy.jpeg',
    title: '천사의 집',
    description: '부산 지역 최대 규모의 유기견 보호소입니다.',
    dogCount: 40,
    likeCount: 210,
  },
];

export default function MainPage() {
  // const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    function checkAuth() {
      checkAuthStatus();
    }

    checkAuth();
  }, [checkAuthStatus]);

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
            <span className={styles.subtitle}>즐겁고 투명한 유기견 후원</span>
            <div className={styles.mainTitle}>
              <span className={styles.highlight}>Let's</span>
              <span> YooHoo!</span>
            </div>
          </h1>
        </div>

        <div className={styles.donationCard}>
          <div className={styles.cardContent}>
            {isAuthenticated ? (
              <>
                <p className={styles.cardText}>
                  <b>{user?.nickname}</b>님, 안녕하세요!
                  <br />
                  <b>따뜻한 후원</b>을 이어가볼까요?
                </p>
                <Link href='/donation' className={styles.donateButton}>
                  후원하러가기
                  <span className={styles.arrow}>→</span>
                </Link>
              </>
            ) : (
              <>
                <p className={styles.cardText}>
                  YooHoo와 함께 시작하는
                  <br />
                  <b>따뜻한 후원</b>
                </p>
                <Link
                  href='/yoohoo/login/kakao'
                  className={styles.donateButton}
                >
                  로그인하기
                  <span className={styles.arrow}>→</span>
                </Link>
              </>
            )}
          </div>

          <div className={styles.piggyImage}>
            <Image
              src='/images/piggy.png'
              alt='돼지 저금통'
              width={110}
              height={78}
            />
          </div>
        </div>

        <div className={styles.dogImage}>
          <Image
            src='/images/mainbandi.png'
            alt='강아지 이미지'
            width={0}
            height={0}
            sizes='100vw'
            style={{
              width: '300px',
              height: 'auto',
            }}
          />
        </div>
      </section>

      <section className={styles.supportSection}>
        <div className={styles.textContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.subtitle}>YooHoo와 함께하는</span>
            <div className={styles.mainTitle}>유기견 후원단체</div>
          </h2>
          <MoveButton variant='secondary' className={styles.moreButton}>
            더보기
          </MoveButton>
        </div>

        <div className={styles.shelterCards}>
          {MOCK_SHELTERS.map((shelter) => (
            <ShelterCard
              key={shelter.id}
              imageUrl={shelter.imageUrl}
              title={shelter.title}
              description={shelter.description}
              dogCount={shelter.dogCount}
              likeCount={shelter.likeCount}
              onClick={() => console.log(`Clicked shelter: ${shelter.title}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
