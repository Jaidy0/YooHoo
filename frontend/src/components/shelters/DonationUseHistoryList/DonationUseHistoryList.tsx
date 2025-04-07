// src/components/shelters/DonationUseHistoryList/DonationUseHistoryList.tsx
import React, { useState } from 'react';
import styles from './DonationUseHistoryList.module.scss';
import DonationUseHistoryItem from '../DonationUseHistoryItem/DonationUseHistoryItem';
import Button from '@/components/common/buttons/Button/Button';

interface DonationHistory {
  id: number;
  date: string;
  amount: number;
  description: string;
  isVerified: boolean;
}

interface DonationUseHistoryListProps {
  histories: DonationHistory[];
}

export default function DonationUseHistoryList({
  histories,
}: DonationUseHistoryListProps) {
  const [visibleItems, setVisibleItems] = useState(3);

  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, histories.length));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>최근 지출 내역 ({histories.length}건)</h3>
      <div className={styles.list}>
        {histories.slice(0, visibleItems).map((history) => (
          <DonationUseHistoryItem
            key={history.id}
            date={history.date}
            amount={history.amount}
            description={history.description}
            isVerified={history.isVerified}
          />
        ))}
        {visibleItems < histories.length && (
          <Button
            width='100%'
            className={styles.moreBtn}
            onClick={handleLoadMore}
          >
            + 더보기
          </Button>
        )}
      </div>
    </div>
  );
}
