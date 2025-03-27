import styles from './AccountInfoCard.module.scss';
import { IconBox } from '@/components/common/IconBox/IconBox';

type AccountInfoCardProps = {
  title: string;
  bankName: string;
  accountNumber: string;
};

export default function AccountInfoCard({
  title,
  bankName,
  accountNumber,
}: AccountInfoCardProps) {
  return (
    <>
      <div className={styles.cardHeader}>{title}</div>
      <div className={styles.accountInfoCard}>
        <div className={styles.cardContent}>
          <div className={styles.iconWrapper}>
            <IconBox name='account' size={24} />
          </div>
          <div className={styles.accountDetails}>
            <p className={styles.bankName}>{bankName}</p>
            <p className={styles.accountNumber}>{accountNumber}</p>
          </div>
        </div>
      </div>
    </>
  );
}
