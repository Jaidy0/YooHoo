import React from 'react';
import styles from './DonationUseHistoryItem.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

interface DonationUseHistoryItemProps {
  date?: string;
  category: string;
  transactionBalance: string | number;
  file_id?: string;
  dogName?: string;
  type?: string;
  transactionUniqueNo: string;
  withdrawalId: number;
  name: string;
  onEvidenceClick?: (transactionUniqueNo: number, type: boolean) => void;
  onReceiptClick?: (withdrawalId: number) => void;
  content?: string;
}

export default function DonationUseHistoryItem({
  date,
  category = '기타',
  transactionBalance,
  file_id = '1',
  // dogName = '미분류',
  // type,
  transactionUniqueNo,
  withdrawalId,
  name,
  onEvidenceClick,
  onReceiptClick,
  content,
}: DonationUseHistoryItemProps) {
  // 금액 포맷팅 (천 단위 콤마)
  const amount = Number(transactionBalance || 0);
  const formattedAmount = amount.toLocaleString();

  // category가 'unknown'이면 '기타'로 표시
  // const displayCategory = category === 'Unknown' ? '기타' : category;
  // content가 'Unknown Merchant'이면 '기타 지출'로 표시
  const displayContent = content === 'Unknown Merchant' ? '기타 지출' : content;

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <span className={styles.date}>{date}</span>
        <div className={styles.nameContainer}>
          {name !== '단체' && <span className={styles.dogName}>{name}</span>}
          <span className={styles.description}>
            {/* {displayCategory || '내역 없음'} */}
            {displayContent}
          </span>
        </div>
      </div>
      <div className={styles.rightContent}>
        <span
          className={`${styles.amount} ${amount < 0 ? styles.negative : ''}`}
        >
          - {formattedAmount}
        </span>
        <div className={styles.btnContainer}>
          {file_id && (
            <RoundButton
              className={styles.btn}
              onClick={() => onReceiptClick?.(withdrawalId)}
            >
              활동내용 확인
            </RoundButton>
          )}
          <RoundButton
            className={styles.btn}
            onClick={() =>
              onEvidenceClick?.(
                Number(transactionUniqueNo),
                category === '인건비'
              )
            } //통장 증빙 자료
          >
            증빙 자료
          </RoundButton>
        </div>
      </div>
    </div>
  );
}
