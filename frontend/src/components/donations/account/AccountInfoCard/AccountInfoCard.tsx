import styles from './AccountInfoCard.module.scss';
import { IconBox } from '@/components/common/IconBox/IconBox';

type AccountInfoCardProps = {
  title: string;
  bankName: string;
  accountNumber: string;
  isSelected?: boolean; // 선택 여부 prop 추가
};

export default function AccountInfoCard({
  title,
  bankName,
  accountNumber,
  isSelected = false, // 기본값은 false
}: AccountInfoCardProps) {
  // 계좌번호 포맷팅 함수 (ex: 1234-5678-9012 형식으로 변환)
  const formatAccountNumber = (accountNo: string) => {
    // 기본 포맷팅 로직 (필요에 따라 수정)
    if (accountNo.length > 8) {
      return `${accountNo.slice(0, 4)}-${accountNo.slice(4, 8)}-${accountNo.slice(8)}`;
    }
    return accountNo;
  };

  return (
    <>
      <div className={styles.cardHeader}>{title}</div>
      <div
        className={`${styles.accountInfoCard} ${isSelected ? styles.selected : ''}`}
      >
        <div className={styles.cardContent}>
          <div className={styles.iconWrapper}>
            <IconBox name='account' size={24} />
          </div>
          <div className={styles.accountDetails}>
            <p className={styles.bankName}>{bankName}</p>
            <p className={styles.accountNumber}>
              {formatAccountNumber(accountNumber)}
            </p>
          </div>
          {isSelected && (
            <div className={styles.selectedIndicator}>
              {/* <IconBox name='check' size={20} color="#4CAF50" /> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
