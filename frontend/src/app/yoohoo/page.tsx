'use client';

import Link from 'next/link';
import styles from './page.module.scss';
import Image from 'next/image';
import ShelterCard from '@/components/shelters/ShelterCard/ShelterCard';
import MoveButton from '@/components/common/buttons/MoveButton/MoveButton';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import IconBox from '@/components/common/IconBox/IconBox';
import { useShelterList } from '@/hooks/useShelterList';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { Shelter } from '@/types/shelter';
import MainHeader from '@/components/layout/Header/MainHeader';

export default function MainPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuthStatus } = useAuthStore();
  const { shelters, isLoading, error } = useShelterList();

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    function checkAuth() {
      checkAuthStatus();
    }
    checkAuth();
    console.log('메인페이지 로그인 여부 체크합니다.');
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (error) {
    return <div>단체 조회 오류</div>;
  }

  return (
    <div className={styles.container}>
      <MainHeader />
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
                <Link href='/yoohoo/donate' className={styles.donateButton}>
                  후원하기
                  <IconBox name='arrow' size={20} rotate={180}></IconBox>
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
                  <IconBox name='arrow' size={20} rotate={180}></IconBox>
                </Link>
              </>
            )}
          </div>

          <div className={styles.piggyImage}>
            <Image
              src='/images/piggy.png'
              alt='돼지 저금통'
              layout='responsive' // layout 속성을 responsive로 설정
              width={120}
              height={120}
            />
          </div>
        </div>

        <div className={styles.dogImage}>
          {isAuthenticated ? (
            <Image
              src='/images/bandi-bark.png'
              alt='강아지 이미지'
              width={0}
              height={0}
              sizes='100vw'
              style={{
                width: '340px',
                height: 'auto',
              }}
            />
          ) : (
            <Image
              src='/images/bandi-standing.png'
              alt='강아지 이미지'
              width={0}
              height={0}
              sizes='100vw'
              style={{
                width: '330px',
                height: 'auto',
              }}
            />
          )}
          <div className={styles.dogImageIcon}>
            <IconBox
              name='chevron'
              size={30}
              color='var(--yh-brown)'
              rotate={90}
            ></IconBox>
          </div>
        </div>
      </section>

      <section className={styles.supportSection}>
        <div className={styles.textContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.subtitle}>믿고 후원하는</span>
            <div className={styles.mainTitle}>YooHoo 보호 단체</div>
          </h2>
          <Link href='/yoohoo/shelters'>
            <MoveButton variant='yellow' className={styles.moreButton}>
              더보기
            </MoveButton>
          </Link>
        </div>

        <div className={styles.shelterCards}>
          {shelters.slice(0, 5).map((shelter: Shelter) => (
            <ShelterCard
              key={shelter.shelterId}
              imageUrl={shelter.imageUrl}
              title={shelter.name}
              description={shelter.content}
              dogCount={shelter.dogCount}
              reliability={shelter.reliability}
              onClick={() => {
                router.push(`/yoohoo/shelters/${shelter.shelterId}`);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
