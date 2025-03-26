import styles from './DonationTracker.module.scss';
import Badge from '@/components/common/Badge/Badge';

export interface DonationTrackerProps {
  variant: 'total' | 'withdraw' | 'deposit';
  amount: number;
  compareDeposit?: number;
  compareWithdraw?: number;
}

export default function DonationTracker({
  variant,
  amount,
  compareDeposit = 0,
  compareWithdraw = 0,
}: DonationTrackerProps) {
  // variant에 따라 클래스명 결정
  const cardClassName = `${styles.trackerCard} ${styles[variant]}`;

  // 한국식 숫자 표기법으로 변환
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  // 총합 콘텐츠 렌더링
  const renderTotalContent = () => (
    <>
      <div className={styles.header}>
        <span className={styles.subText}>총</span>
        <span className={styles.amount}>{formatAmount(amount)}</span>
        <span className={styles.subText}> 원</span>
      </div>
      <div className={styles.totalContent}>
        <div className={styles.compareWrapper}>
          <span className={styles.plainText}>지난 달</span>
          <span className={styles.withdrawText}>수입</span>
          <span className={styles.plainText}>대비</span>
          <span className={styles.withdrawText}>
            {formatAmount(compareWithdraw)}
          </span>
          <span className={styles.plainText}>원</span>
        </div>

        <div className={styles.compareWrapper}>
          <span className={styles.plainText}>지난 달</span>
          <span className={styles.depositText}>지출</span>
          <span className={styles.plainText}>대비</span>
          <span className={styles.depositText}>
            {formatAmount(compareDeposit)}
          </span>
          <span className={styles.plainText}>원</span>
        </div>
      </div>
    </>
  );

  // 트렌드 콘텐츠 렌더링
  const renderSubContent = () => (
    <div className={styles.simple}>
      {variant == 'deposit' ? (
        <Badge variant='negative' className={styles.badge}>
          출금
        </Badge>
      ) : (
        <Badge variant='positive' className={styles.badge}>
          입금
        </Badge>
      )}

      <span className={styles.amount}>{formatAmount(amount)}</span>
      <span className={styles.subText}> 원</span>
    </div>
  );

  return (
    <div className={cardClassName}>
      {variant === 'total' ? renderTotalContent() : renderSubContent()}
    </div>
  );
}
