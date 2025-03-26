import styles from './DepositTableRow.module.scss';
import Badge from '@/components/common/Badge/Badge';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

export interface DepositTableRowProps {
  variant?: 'header' | 'row';
  type: string;
  category?: string;
  content?: string;
  amount: number;
  date: string;
  isEvidence: boolean;
  evidence?: string;
  isReceipt: boolean;
  receipt?: string;
}

const formatAmount = (value: number) => {
  return new Intl.NumberFormat('ko-KR').format(value);
};

export default function DepositTableRow({
  variant = 'row',
  type,
  category = '-',
  content = '-',
  amount,
  date,
  isEvidence,
  evidence = '',
  isReceipt,
  receipt = '',
}: DepositTableRowProps) {
  return (
    <div className={styles.all}>
      {variant === 'header' ? (
        <div className={styles.header}>
          <div className={styles.badgeWrapper}>구분</div>
          <div className={styles.category}>카테고리</div>
          <div className={styles.amount}>금액</div>
          <div className={styles.content}>내용</div>
          <div className={styles.date}>날짜</div>
          <div className={styles.evidence}>증빙자료</div>
          <div className={styles.receipt}>영수증</div>
        </div>
      ) : (
        <div className={styles.row}>
          <div className={styles.badgeWrapper}>
            <Badge variant='negative' className={styles.badge}>
              {type}
            </Badge>
          </div>
          <div className={styles.category}>{category}</div>
          <div className={styles.amount}>{formatAmount(amount)}</div>
          <div className={styles.content}>{content}</div>
          <div className={styles.date}>{date}</div>
          <div className={styles.evidence}>
            {isEvidence ? (
              <RoundButton
                variant='primary'
                onClick={() => console.log(evidence)}
              >
                자료보기
              </RoundButton>
            ) : (
              <RoundButton variant='secondary'>추가하기</RoundButton>
            )}
          </div>
          <div className={styles.receipt}>
            {isReceipt ? (
              <RoundButton
                variant='primary'
                onClick={() => console.log(receipt)}
              >
                자료보기
              </RoundButton>
            ) : (
              <RoundButton variant='secondary'>추가하기</RoundButton>
            )}
          </div>{' '}
        </div>
      )}
    </div>
  );
}
