import { useState, useCallback } from 'react';
import styles from './FinanceTable.module.scss';
import Badge from '@/components/common/Badge/Badge';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import DogSelectModal from '@/components/admin/DogSelectModal/DogSelectModal';
import EvidanceModal from '@/components/admin/EvidenceModal/EvidanceModal';
import ReceiptModal from '@/components/admin/ReceiptModal/ReceiptModal';
import ReceiptUploadModal from '@/components/admin/ReceiptUploadModal/ReceiptUploadModal';
import IconBox from '@/components/common/IconBox/IconBox';

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
  dogId?: number | null;
  dogName?: string | null;
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
  file_id,
  dogId: initialDogId = null,
  dogName: initialDogName = null,
}: WithdrawTableRowProps) {
  // 로컬 상태 관리
  const [hasUploadedReceipt, setHasUploadedReceipt] = useState(
    file_id !== null
  );
  const [localDogId, setLocalDogId] = useState<number | null>(initialDogId);
  const [localDogName, setLocalDogName] = useState<string | null>(
    initialDogName
  );

  // 모달 상태 관리
  const [isDogSelectModalOpen, setIsDogSelectModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isReceiptUploadModalOpen, setIsReceiptUploadModalOpen] =
    useState(false);

  // 영수증 존재 여부 - hasUploadedReceipt 상태 기준으로 판단
  const hasReceipt = hasUploadedReceipt;

  // 강아지 할당 여부 - localDogId를 기준으로 판단
  const hasDogAssigned = localDogId !== null && localDogName !== null;

  // 뱃지 텍스트 - 강아지가 할당되었으면 "지정(강아지이름)"으로 표시
  const badgeText = hasDogAssigned ? `지정(${localDogName})` : type;

  // 모달 열기 핸들러
  const openDogSelectModal = () => setIsDogSelectModalOpen(true);
  const openEvidenceModal = () => setIsEvidenceModalOpen(true);
  const openReceiptModal = () => setIsReceiptModalOpen(true);
  const openReceiptUploadModal = () => setIsReceiptUploadModalOpen(true);

  // DogSelect 모달 닫기
  const closeDogSelectModal = useCallback(() => {
    setIsDogSelectModalOpen(false);
  }, []);

  // 강아지 선택 성공 콜백
  const handleDogSelectSuccess = useCallback(
    (dogId: number, dogName: string) => {
      // 낙관적 업데이트 수행
      setLocalDogId(dogId);
      setLocalDogName(dogName);
      setIsDogSelectModalOpen(false);
    },
    []
  );

  // 영수증 업로드 성공 콜백
  const handleReceiptUploadSuccess = useCallback(() => {
    // 영수증 업로드 성공 상태로 변경
    setHasUploadedReceipt(true);
  }, []);

  // 일반 모달 닫기 핸들러
  const closeEvidenceModal = () => setIsEvidenceModalOpen(false);
  const closeReceiptModal = () => setIsReceiptModalOpen(false);
  const closeReceiptUploadModal = () => setIsReceiptUploadModalOpen(false);

  // 영수증 버튼 클릭 핸들러 - hasReceipt 기준으로 변경
  const handleReceiptButtonClick = () => {
    if (hasReceipt) {
      openReceiptModal();
    } else {
      openReceiptUploadModal();
    }
  };

  // category가 'Unknown'인 경우 '기타'로 표시
  const displayCategory = category === 'Unknown' ? '기타' : category;
  const displayContent = category === 'Unknown' ? ' 기타 지출' : content;

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
          <div className={styles.receipt}>활동내용</div>
        </div>
      ) : (
        <div className={styles.row}>
          <div className={styles.badgeWrapper}>
            <Badge
              variant='negative'
              className={styles.badge}
              onClick={openDogSelectModal}
            >
              <div className={styles.badgeContent}>
                {badgeText}
                <IconBox name='chevron' rotate={90} size={15} />
              </div>
            </Badge>
          </div>
          <div className={styles.category}>{displayCategory}</div>
          <div className={styles.amount}>{formatAmount(amount)}</div>
          <div className={styles.content}>{displayContent}</div>
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
              {hasReceipt ? '활동자료' : '추가하기'}
            </RoundButton>
          </div>
        </div>
      )}

      {/* 강아지 선택 모달 - onSuccess 콜백 추가 */}
      <DogSelectModal
        isOpen={isDogSelectModalOpen}
        onClose={closeDogSelectModal}
        withDrawId={withdrawalId}
        title={`${type} 상세 정보`}
        initialDogId={localDogId?.toString()}
        onSuccess={handleDogSelectSuccess}
      />

      {/* 증빙자료 모달 */}
      <EvidanceModal
        isOpen={isEvidenceModalOpen}
        onClose={closeEvidenceModal}
        transactionUniqueNo={transactionUniqueNo}
        type={category === '인건비'}
      />

      {/* 영수증 모달 - 영수증이 있을 때만 표시 */}
      {hasReceipt && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={closeReceiptModal}
          withdrawId={withdrawalId}
        />
      )}

      {/* 영수증 업로드 모달 - 영수증이 없을 때만 표시 */}
      {!hasReceipt && (
        <ReceiptUploadModal
          isOpen={isReceiptUploadModalOpen}
          onClose={closeReceiptUploadModal}
          withdrawId={withdrawalId}
          onUploadSuccess={handleReceiptUploadSuccess}
        />
      )}
    </div>
  );
}
