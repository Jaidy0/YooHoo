import styles from './WithdrawTableRow.module.scss';
import Badge from '@/components/common/Badge/Badge';

export interface WithdrawTableRowProps {
  variant?: 'header' | 'row';
  type: string;
  name: string;
  amount: number;
  message?: string;
  date: string;
}

// 한국식 숫자 표기법으로 변환
const formatAmount = (value: number) => {
  return new Intl.NumberFormat('ko-KR').format(value);
};
export default function WithdrawTableRow({
  variant = 'row',
  type,
  name,
  amount,
  message = '-',
  date,
}: WithdrawTableRowProps) {
  return (
    <div className={styles.all}>
      {variant === 'header' ? (
        <div className={styles.header}>
          <div className={styles.badgeWrapper}>{type}</div>
          <div className={styles.name}>{name}</div>
          <div className={styles.amount}>금액</div>
          <div className={styles.message}>{message}</div>
          <div className={styles.date}>{date}</div>
        </div>
      ) : (
        <div className={styles.row}>
          <div className={styles.badgeWrapper}>
            <Badge className={styles.badge}>{type}</Badge>
          </div>
          <div className={styles.name}>{name}</div>
          <div className={styles.amount}>{formatAmount(amount)}</div>
          <div className={styles.message}>{message}</div>
          <div className={styles.date}>{date}</div>
        </div>
      )}
    </div>
  );
}
