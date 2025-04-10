import React from 'react';
import styles from './DogExpenseHistoryItem.module.scss';

interface DogExpenseHistoryItemProps {
  date: string;
  category: string;
  content: string;
  amount: string;
}

export default function DogExpenseHistoryItem({
  date,
  category,
  content,
  amount,
}: DogExpenseHistoryItemProps) {
  return (
    <div className={styles.expenseItem}>
      <div className={styles.data}>
        <div className={styles.date}>{date}</div>
        <div className={styles.category}>{category}</div>
        <div className={styles.content}>{content}</div>
      </div>
      <div className={styles.amount}>
        <span className={styles.amountText}>{amount}</span>
      </div>
    </div>
  );
}
