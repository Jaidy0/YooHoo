import React from 'react';
import styles from './DonationUseHistoryItem.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

interface DonationUseHistoryItemProps {
  /** 날짜 */
  date: string;
  /** 금액 */
  amount: number;
  /** 사용 내역 */
  description: string;
  /** 증빙 확인 여부 */
  isVerified?: boolean;
}

export default function DonationUseHistoryItem({
  date,
  amount,
  description,
  isVerified = false,
}: DonationUseHistoryItemProps) {
  // 금액 포맷팅 (천 단위 콤마)
  const formattedAmount = amount.toLocaleString();

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <span className={styles.date}>{date}</span>
        <span className={styles.description}>{description}</span>
      </div>
      <div className={styles.rightContent}>
        <span
          className={`${styles.amount} ${amount < 0 ? styles.negative : ''}`}
        >
          {amount > 0 ? '+' : ''}
          {formattedAmount}
        </span>
        {isVerified && (
          <RoundButton className={styles.btn}>증빙 확인</RoundButton>
        )}
      </div>
    </div>
  );
}
