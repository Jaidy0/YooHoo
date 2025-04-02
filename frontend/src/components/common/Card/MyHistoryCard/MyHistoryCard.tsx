import styles from './MyHistoryCard.module.scss';
import Badge from '../../Badge/Badge';

export interface MyHistoryCardProps {
  badgeText: string;
  subText: string;
  mainText: string;
  date: string;
  variant?: 'history' | 'alarm';
  className?: string;
  style?: React.CSSProperties;
}

export default function MyHistoryCard({
  badgeText,
  subText,
  mainText,
  date,
  variant = 'history',
  className = '',
  style,
}: MyHistoryCardProps) {
  return (
    <div
      className={`${className} ${styles.cardWrapper} ${styles[variant]}`}
      style={style}
    >
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
