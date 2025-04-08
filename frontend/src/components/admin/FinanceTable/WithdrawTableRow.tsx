import { useState, useCallback } from 'react';
import styles from './FinanceTable.module.scss';
import Badge from '@/components/common/Badge/Badge';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import DogSelectModal from '@/components/admin/DogSelectModal/DogSelectModal';
import EvidanceModal from '@/components/admin/EvidenceModal/EvidanceModal';
import ReceiptModal from '@/components/admin/ReceiptModal/ReceiptModal';
import ReceiptUploadModal from '@/components/admin/ReceiptUploadModal/ReceiptUploadModal';

export interface WithdrawTableRowProps {
  variant?: 'header' | 'row';
  withdrawalId: number;
  type: string;
  category?: string;
  content?: string;
  amount: number;
  date: string;
  transactionUniqueNo: number;
  file_id: string | null;
  onReceiptChange?: () => void; // 영수증 변경 시 호출할 콜백
}

const formatAmount = (value: number) => {
  return new Intl.NumberFormat('ko-KR').format(value);
};

export default function WithdrawTableRow({
  variant = 'row',
  withdrawalId,
  type,
  category = '-',
  content = '-',
  amount,
  date,
  transactionUniqueNo,
  onReceiptChange,
  file_id,
}: WithdrawTableRowProps) {
  // 모달 상태 관리
  const [isDogSelectModalOpen, setIsDogSelectModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isReceiptUploadModalOpen, setIsReceiptUploadModalOpen] =
    useState(false);

  // 영수증 존재 여부 - file_id를 기준으로 판단
  const hasReceipt = file_id !== null;

  // 영수증 변경 처리
  const handleReceiptChange = useCallback(() => {
    // 부모 컴포넌트에 변경 알림
    onReceiptChange?.();
  }, [onReceiptChange]);

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

  // 영수증 업로드 모달 열기/닫기
  const openReceiptUploadModal = () => {
    setIsReceiptUploadModalOpen(true);
  };
  const closeReceiptUploadModal = () => {
    setIsReceiptUploadModalOpen(false);
  };

  // 영수증 버튼 클릭 핸들러 - file_id 기준으로 변경
  const handleReceiptButtonClick = () => {
    if (hasReceipt) {
      openReceiptModal();
    } else {
      openReceiptUploadModal();
    }
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
            <RoundButton variant='primary' onClick={openEvidenceModal}>
              자료보기
            </RoundButton>
          </div>
          <div className={styles.receipt}>
            <RoundButton
              variant={hasReceipt ? 'primary' : 'secondary'}
              onClick={handleReceiptButtonClick}
            >
              {hasReceipt ? '영수증보기' : '추가하기'}
            </RoundButton>
          </div>
        </div>
      )}

      {/* 강아지 선택 모달 */}
      <DogSelectModal
        isOpen={isDogSelectModalOpen}
        onClose={closeDogSelectModal}
        withDrawId={withdrawalId}
        title={`${type} 상세 정보`}
      />

      {/* 증빙자료 모달 */}
      <EvidanceModal
        isOpen={isEvidenceModalOpen}
        onClose={closeEvidenceModal}
        transactionUniqueNo={transactionUniqueNo}
        type={type === '인건비'}
      />

      {/* 영수증 모달 - file_id가 null이 아닐 때 표시 */}
      {hasReceipt && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={closeReceiptModal}
          withdrawId={withdrawalId}
        />
      )}

      {/* 영수증 업로드 모달 - file_id가 null일 때 표시 */}
      {!hasReceipt && (
        <ReceiptUploadModal
          isOpen={isReceiptUploadModalOpen}
          onClose={closeReceiptUploadModal}
          withdrawId={withdrawalId}
          onUploadSuccess={handleReceiptChange}
        />
      )}
    </div>
  );
}
