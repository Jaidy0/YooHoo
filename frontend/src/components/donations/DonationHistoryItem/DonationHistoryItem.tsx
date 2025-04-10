'use client';

import { useState } from 'react';
import styles from './DonationHistoryItem.module.scss';

interface DonationHistoryItemProps {
  date: string;
  donorName: string;
  amount: string;
  message: string;
}

export default function DonationHistoryItem({
  date,
  donorName,
  amount,
  message,
}: DonationHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMessage = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.historyItem}>
      <div className={styles.historyItemContainer}>
        <div className={styles.historyDate}>{date}</div>
        <div className={styles.historyContent}>
          <span className={styles.donorName}>{donorName}</span>
          <span className={styles.donationValue}>{amount}</span>
        </div>
      </div>
      <div className={styles.historyMessage}>
        <p
          className={`${styles.historyMessageContent} ${isExpanded ? styles.expanded : ''}`}
        >
          {message}
          {!isExpanded && message.length > 50 && (
            <button className={styles.moreButton} onClick={toggleMessage}>
              더보기
            </button>
          )}
        </p>
        {isExpanded && (
          <button className={styles.moreButton} onClick={toggleMessage}>
            접기
          </button>
        )}
      </div>
    </div>
  );
}
