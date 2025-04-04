import React from 'react';
import MedalIcon from '../MedalIcon';
import PawBackground from '../PawBackground';
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
  return (
    <div className={`${styles.certificateCard} ${className}`}>
      <div className={styles.ribbon}></div>
      <div className={styles.medal}>
        <MedalIcon className={styles.medalIcon} />
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
      </div>

      <div className={styles.certificateMessage}>
        <p>따뜻한 마음을 담아 반려동물 소중한 후원금은</p>
        <p>유기견들의 주거, 치료, 음식, 돌봄을 위해 소중히 사용하겠습니다.</p>
        <p>여러분의 따뜻한 나눔이 아이들에게 새로운 희망이 되어 줄 것입니다.</p>
        <p>유기견들이 행복한 삶을 찾아가는 길에 함께해 주셔서 감사합니다!</p>
      </div>

      <div className={styles.certificateFooter}>
        <div className={styles.date}>{date}</div>
        <div className={styles.logo}>유후</div>
      </div>

      <div className={styles.backgroundPaw}>
        <PawBackground />
      </div>
    </div>
  );
}
