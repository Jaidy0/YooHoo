import styles from './AccountInfoCard.module.scss';
import { IconBox } from '@/components/common/IconBox/IconBox';

type AccountInfoCardProps = {
  bankName: string;
  accountNumber: string;
  isSelected?: boolean;
};

export default function AccountInfoCard({
  bankName,
  accountNumber = '', // 기본값 제공
  isSelected = false,
}: AccountInfoCardProps) {
  // 계좌번호 포맷팅 함수 (undefined/null 체크 추가)
  const formatAccountNumber = (accountNo: string) => {
    // accountNo가 없거나 문자열이 아닌 경우 빈 문자열 반환
    if (!accountNo) return '';

    // 기본 포맷팅 로직
    if (accountNo.length > 8) {
      return `${accountNo.slice(0, 4)}-${accountNo.slice(4, 8)}-${accountNo.slice(8)}`;
    }
    return accountNo;
  };

  return (
    <>
      <div
        className={`${styles.accountInfoCard} ${isSelected ? styles.selected : ''}`}
      >
        <div className={styles.cardContent}>
          <div className={styles.iconWrapper}>
            <IconBox name='account' size={24} />
          </div>
          <div className={styles.accountDetails}>
            <p className={styles.bankName}>{bankName || '은행 정보 없음'}</p>
            <p className={styles.accountNumber}>
              {accountNumber
                ? formatAccountNumber(accountNumber)
                : '계좌번호 정보 없음'}
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
