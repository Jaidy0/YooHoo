import React from 'react';
import Modal from '@/components/common/Modal/Modal';
import styles from './EvidanceModal.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import { useBankbookWithdrawal } from '@/hooks/useWithdrawlEvidane';
import { useCardWithdrawal } from '@/hooks/useCardWithdrawalEvidance';
import {
  formatDate,
  formatTime,
  formatCurrency,
  formatCardNumber,
} from '@/lib/util/evidanceFormatter';

interface EvidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionUniqueNo: number;
  type: boolean; // false: 카드 증빙, true: 통장 출금 증빙
  shelterId?: number; // 선택적 패러미터로 변경
  className?: string;
}

export default function EvidanceModal({
  className,
  isOpen,
  onClose,
  transactionUniqueNo = 0,
  type,
  shelterId = 5, // 기본값 제공
}: EvidanceModalProps) {
  // 통장 출금 내역 조회 (type이 true일 때)
  const bankbookData = useBankbookWithdrawal({
    transactionUniqueNo,
    shelterId,
    enabled: isOpen && type,
  });

  // console.log('***!!! bankbookData : ', bankbookData);

  // 카드 내역 조회 (type이 false일 때)
  const cardData = useCardWithdrawal({
    shelterId,
    transactionUniqueNo,
    enabled: isOpen && !type,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='증빙자료'
      className={className}
    >
      <div className={styles.evidenceContainer}>
        {type ? (
          // 통장 출금 증빙 (type이 true일 때)
          <>
            {bankbookData.isLoading ? (
              <div className={styles.loadingMessage}>
                데이터를 불러오는 중입니다...
              </div>
            ) : bankbookData.error ? (
              <div className={styles.errorMessage}>
                데이터를 불러오는 중 오류가 발생했습니다.
              </div>
            ) : bankbookData.filteredTransaction ? (
              <div className={styles.bankbookData}>
                <h3 className={styles.sectionTitle}>통장 출금 내역</h3>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래일시:</span>
                  <span className={styles.value}>
                    {formatDate(
                      bankbookData.filteredTransaction.transactionDate
                    )}{' '}
                    {formatTime(
                      bankbookData.filteredTransaction.transactionTime
                    )}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래유형:</span>
                  <span className={styles.value}>
                    {bankbookData.filteredTransaction.transactionTypeName}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>계좌번호:</span>
                  <span className={styles.value}>
                    {bankbookData.filteredTransaction.transactionAccountNo}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래금액:</span>
                  <span className={styles.value}>
                    {formatCurrency(
                      Number(
                        bankbookData.filteredTransaction.transactionBalance
                      )
                    )}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래 후 잔액:</span>
                  <span className={styles.value}>
                    {formatCurrency(
                      Number(
                        bankbookData.filteredTransaction.transactionAfterBalance
                      )
                    )}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래요약:</span>
                  <span className={styles.value}>
                    {bankbookData.filteredTransaction.transactionSummary}
                  </span>
                </div>
                {bankbookData.filteredTransaction.transactionMemo && (
                  <div className={styles.dataRow}>
                    <span className={styles.label}>메모:</span>
                    <span className={styles.value}>
                      {bankbookData.filteredTransaction.transactionMemo}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noDataMessage}>
                해당 거래번호의 거래 정보가 없습니다.
              </div>
            )}
          </>
        ) : (
          // 카드 증빙 (type이 false일 때) - 변경 없음
          <>
            {cardData.isLoading ? (
              <div className={styles.loadingMessage}>
                데이터를 불러오는 중입니다...
              </div>
            ) : cardData.error ? (
              <div className={styles.errorMessage}>
                데이터를 불러오는 중 오류가 발생했습니다.
              </div>
            ) : cardData.filteredTransaction ? (
              <div className={styles.cardData}>
                <h3 className={styles.sectionTitle}>카드 거래 내역</h3>

                <div className={styles.cardInfo}>
                  <div className={styles.merchantName}>
                    {cardData.filteredTransaction.merchantName}
                  </div>
                  <div className={styles.transactionAmount}>
                    {formatCurrency(
                      Number(cardData.filteredTransaction.transactionBalance)
                    )}
                  </div>
                </div>

                <div className={styles.dataRow}>
                  <span className={styles.label}>거래일시:</span>
                  <span className={styles.value}>
                    {formatDate(cardData.filteredTransaction.transactionDate)}{' '}
                    {formatTime(cardData.filteredTransaction.transactionTime)}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>카드번호:</span>
                  <span className={styles.value}>
                    {cardData.data?.REC.cardNo
                      ? formatCardNumber(cardData.data.REC.cardNo)
                      : ''}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>카드종류:</span>
                  <span className={styles.value}>
                    {cardData.data?.REC.cardName ?? ''}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래상태:</span>
                  <span className={styles.value}>
                    {cardData.filteredTransaction.cardStatus}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>거래분류:</span>
                  <span className={styles.value}>
                    {cardData.filteredTransaction.categoryName}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.label}>결제상태:</span>
                  <span className={styles.value}>
                    {cardData.filteredTransaction.billStatementsStatus}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.noDataMessage}>
                해당 거래 번호의 카드 내역을 찾을 수 없습니다.
              </div>
            )}
          </>
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
