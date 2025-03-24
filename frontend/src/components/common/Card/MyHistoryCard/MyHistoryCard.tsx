import styles from './MyHistoryCard.module.scss';
import Badge from '../../Badge/Badge';

export interface MyHistoryCardProps {
  badgeText: string;
  subText: string;
  mainText: string;
  date: string;
  variant?: 'history' | 'alarm';
}

export default function MyHistoryCard({
  badgeText,
  subText,
  mainText,
  date,
  variant = 'history',
}: MyHistoryCardProps) {
  return (
    <div className={`${styles.cardWrapper} ${styles[variant]}`}>
      <div className={styles.header}>
        <Badge>{badgeText}</Badge>
        <span className={styles.date}>{date}</span>
      </div>
      <div className={styles.content}>
        <p className={styles.subText}>{subText}</p>
        <p className={styles.mainText}>{mainText}</p>
      </div>
    </div>
  );
}
