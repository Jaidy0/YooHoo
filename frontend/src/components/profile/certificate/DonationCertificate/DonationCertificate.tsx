import React, { useRef } from 'react';
import Image from 'next/image';
import styles from './DonationCertificate.module.scss';

interface DonationCertificateProps {
  username: string;
  amount: number;
  date: string;
  className?: string;
}

export default function DonationCertificate({
  username,
  amount,
  date,
  className = '',
}: DonationCertificateProps) {
  // 이미지 refs
  const medalRef = useRef(null);
  const dogRef = useRef(null);
  const iconRef = useRef(null);

  return (
    <div className={`${styles.certificateCard} ${className}`}>
      {/* 내부 테두리 - html2canvas에서 캡처되도록 실제 엘리먼트로 만듦 */}
      <div className={styles.innerBorder}></div>

      {/* 메달 이미지 */}
      <div className={styles.medalContainer}>
        <Image
          ref={medalRef}
          src='/images/medal.svg'
          alt='Medal'
          width={100}
          height={100}
          className={styles.medalImage}
          priority
          unoptimized // 이미지 최적화를 건너뛰어 원본 그대로 표시
        />
      </div>

      {/* 배경 도그 인증서 이미지 */}
      <div className={styles.backgroundDogCertificate}>
        <Image
          ref={dogRef}
          src='/images/dog_certificates.svg'
          alt='Background'
          width={200}
          height={200}
          className={styles.backgroundImage}
          unoptimized
        />
      </div>

      <h2 className={styles.certificateTitle}>후원증서</h2>

      <div className={styles.certificateContent}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>후원자명</span>
          <span className={styles.infoValue}>{username}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>후원 금액</span>
          <span className={styles.infoValue}>{amount.toLocaleString()}원</span>
        </div>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.certificateMessage}>
        <p>따뜻한 마음을 담아 보내주신 소중한 후원금은</p>
        <p>유기견들의 주거, 치료, 음식, 돌봄을 위해 소중히 사용하겠습니다.</p>
        <p>여러분의 나눔이 아이들에게 새로운 희망이 되어 줄 것입니다.</p>
        <br />
        <p>유기견들의 행복을 찾아가는 길에 함께해 주셔서 감사합니다!</p>
      </div>

      <div className={styles.certificateFooter}>
        <div className={styles.date}>{date}</div>
        <div className={styles.logoContainer}>
          <span className={styles.logo}>유후</span>
          <Image
            ref={iconRef}
            src='/images/yh-icon.svg'
            alt='Yoohoo Icon'
            width={24}
            height={24}
            className={styles.logoIcon}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
