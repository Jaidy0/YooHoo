'use client';

import Link from 'next/link';
import styles from './page.module.scss';
import Image from 'next/image';

export default function MainPage() {
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
            <p className={styles.cardText}>
              YooHoo와 함께 시작하는
              <br />
              <b>따뜻한 후원</b>
            </p>
            <Link href='/donation' className={styles.donateButton}>
              후원하러가기
              <span className={styles.arrow}>→</span>
            </Link>
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
      </section>
    </div>
  );
}
