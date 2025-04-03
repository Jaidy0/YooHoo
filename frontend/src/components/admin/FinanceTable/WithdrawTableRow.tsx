import { useState } from 'react';
import styles from './FinanceTable.module.scss';
import Badge from '@/components/common/Badge/Badge';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import DogSelectModal from '@/components/admin/DogSelectModal/DogSelectModal';
import EvidanceModal from '@/components/admin/EvidenceModal/EvidanceModal';
import ReceiptModal from '@/components/admin/ReceiptModal/ReceiptModal';

export interface WithdrawTableRowProps {
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

export default function WithdrawTableRow({
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
}: WithdrawTableRowProps) {
  // 모달 상태 관리
  const [isDogSelectModalOpen, setIsDogSelectModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // DogSelect 모달 열기/닫기
  const openDogSelectModal = () => {
    setIsDogSelectModalOpen(true);
  };
  const closeDogSelectModal = () => {
    setIsDogSelectModalOpen(false);
  };

  // 증빙자료 모달 열기/닫기
  const openEvidenceModal = () => {
    setIsEvidenceModalOpen(true);
  };
  const closeEvidenceModal = () => {
    setIsEvidenceModalOpen(false);
  };

  // 영수증 모달 열기/닫기
  const openReceiptModal = () => {
    setIsReceiptModalOpen(true);
  };
  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
  };

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
            <Badge
              variant='negative'
              className={styles.badge}
              onClick={openDogSelectModal}
            >
              {type}
            </Badge>
          </div>
          <div className={styles.category}>{category}</div>
          <div className={styles.amount}>{formatAmount(amount)}</div>
          <div className={styles.content}>{content}</div>
          <div className={styles.date}>{date}</div>
          <div className={styles.evidence}>
            {isEvidence ? (
              <RoundButton variant='primary' onClick={openEvidenceModal}>
                자료보기
              </RoundButton>
            ) : (
              <RoundButton variant='secondary'>추가하기</RoundButton>
            )}
          </div>
          <div className={styles.receipt}>
            {isReceipt ? (
              <RoundButton variant='primary' onClick={openReceiptModal}>
                영수증보기
              </RoundButton>
            ) : (
              <RoundButton variant='secondary'>추가하기</RoundButton>
            )}
          </div>
        </div>
      )}

      {/* 강아지 선택 모달 */}
      <DogSelectModal
        isOpen={isDogSelectModalOpen}
        onClose={closeDogSelectModal}
        title={`${type} 상세 정보`}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalBadgeContainer}>
            <Badge variant='negative' className={styles.modalBadge}>
              {type}
            </Badge>
          </div>

          <div className={styles.modalGrid}>
            <div className={styles.modalGridItem}>
              <span className={styles.modalLabel}>카테고리</span>
              <span className={styles.modalValue}>{category}</span>
            </div>
            <div className={styles.modalGridItem}>
              <span className={styles.modalLabel}>금액</span>
              <span className={styles.modalValue}>
                {formatAmount(amount)}원
              </span>
            </div>
            <div className={styles.modalGridItem}>
              <span className={styles.modalLabel}>날짜</span>
              <span className={styles.modalValue}>{date}</span>
            </div>
            <div className={styles.modalGridItem}>
              <span className={styles.modalLabel}>내용</span>
              <span className={styles.modalValue}>{content}</span>
            </div>
          </div>

          <div className={styles.modalButtonGroup}>
            {isEvidence && (
              <RoundButton
                variant='secondary'
                onClick={() => {
                  closeDogSelectModal();
                  openEvidenceModal();
                }}
              >
                증빙자료 보기
              </RoundButton>
            )}

            {isReceipt && (
              <RoundButton
                variant='secondary'
                onClick={() => {
                  closeDogSelectModal();
                  openReceiptModal();
                }}
              >
                영수증 보기
              </RoundButton>
            )}
          </div>

          <div className={styles.modalActions}>
            <RoundButton variant='primary' onClick={closeDogSelectModal}>
              확인
            </RoundButton>
          </div>
        </div>
      </DogSelectModal>

      {/* 증빙자료 모달 */}
      <EvidanceModal
        isOpen={isEvidenceModalOpen}
        onClose={closeEvidenceModal}
        evidenceUrl={evidence}
      />

      {/* 영수증 모달 */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={closeReceiptModal}
        receiptUrl={receipt}
      />
    </div>
  );
}
