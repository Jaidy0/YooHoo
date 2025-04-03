import React from 'react';
import Modal from '@/components/common/Modal/Modal';
import styles from './EvidanceModal.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import { useBankbookWithdrawal } from '@/hooks/useWithdrawlEvidane';
import {
  formatDate,
  formatTime,
  formatCurrency,
} from '@/lib/util/evidanceFormatter';

interface EvidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionUniqueNo: number;
  type: boolean; // false: 카드 증빙, true: 통장 출금 증빙
  shelterId?: number; // 선택적 패러미터로 변경
}

export default function EvidanceModal({
  isOpen,
  onClose,
  transactionUniqueNo,
  type,
  shelterId = 5, // 기본값 제공
}: EvidanceModalProps) {
  // 만든 훅을 사용하여 데이터 조회
  const { data, isLoading, error, refetch } = useBankbookWithdrawal({
    transactionUniqueNo,
    shelterId,
    enabled: isOpen && type,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='증빙자료'>
      <div className={styles.evidenceContainer}>
        {type ? (
          // 통장 출금 증빙 (type이 true일 때)
          <>
            {isLoading ? (
              <div className={styles.loadingMessage}>
                데이터를 불러오는 중입니다...
              </div>
            ) : error ? (
              <div className={styles.errorMessage}>
                데이터를 불러오는 중 오류가 발생했습니다.
              </div>
            ) : data ? (
              <div className={styles.bankbookData}>
                <h3 className={styles.sectionTitle}>통장 출금 내역</h3>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래일시:</span>
                  <span className={styles.value}>
                    {formatDate(data.REC.transactionDate)}{' '}
                    {formatTime(data.REC.transactionTime)}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래유형:</span>
                  <span className={styles.value}>
                    {data.REC.transactionTypeName}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>계좌번호:</span>
                  <span className={styles.value}>
                    {data.REC.transactionAccountNo}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래금액:</span>
                  <span className={styles.value}>
                    {formatCurrency(data.REC.transactionBalance)}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래 후 잔액:</span>
                  <span className={styles.value}>
                    {formatCurrency(data.REC.transactionAfterBalance)}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래요약:</span>
                  <span className={styles.value}>
                    {data.REC.transactionSummary}
                  </span>
                </div>
                {data.REC.transactionMemo && (
                  <div className={styles.dataRow}>
                    <span className={styles.label}>메모:</span>
                    <span className={styles.value}>
                      {data.REC.transactionMemo}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noDataMessage}>거래 정보가 없습니다.</div>
            )}
          </>
        ) : (
          // 카드 증빙 (type이 false일 때) - 추후 구현 예정
          <div className={styles.cardData}>
            <p>카드 증빙 데이터는 아직 구현되지 않았습니다.</p>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <RoundButton variant='secondary' onClick={onClose}>
            닫기
          </RoundButton>
        </div>
      </div>
    </Modal>
  );
}
