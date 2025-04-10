// src/components/shelters/DonationUseHistoryList/DonationUseHistoryList.tsx
import React, { useState } from 'react';
import styles from './DonationUseHistoryList.module.scss';
import DonationUseHistoryItem from '../DonationUseHistoryItem/DonationUseHistoryItem';
import Button from '@/components/common/buttons/Button/Button';
import { WithdrawalItem } from '@/types/adminDonation';

interface DonationUseHistoryListProps {
  histories: WithdrawalItem[];
}

export default function DonationUseHistoryList({
  histories,
}: DonationUseHistoryListProps) {
  const [visibleItems, setVisibleItems] = useState(3);

  console.log('***>< histories : ', histories);
  const handleLoadMore = () => {
    setVisibleItems((prev) => Math.min(prev + 5, histories.length));
  };

  // console.log('***>< histories : ', histories);

  return (
    <div className={styles.containerWrap}>
      <div className={styles.container}>
        <div className={styles.list}>
          {histories.slice(0, visibleItems).map((history) => (
            <DonationUseHistoryItem
              key={history.withdrawalId}
              date={history.date}
              name={history.name}
              category={history.category}
              transactionBalance={history.transactionBalance}
              file_id={history.file_id}
              dogName={history.dogName}
              type={history.type}
              transactionUniqueNo={history.transactionUniqueNo}
              withdrawalId={history.withdrawalId}
              onEvidenceClick={history.onEvidenceClick}
              onReceiptClick={history.onReceiptClick}
              content={history.content}
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
    </div>
  );
}
