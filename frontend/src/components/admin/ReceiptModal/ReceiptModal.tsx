import { useState } from 'react';
import Image from 'next/image';
import styles from './ReceiptModal.module.scss';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/buttons/Button/Button';
import { useReceipt } from '@/hooks/useReceipt';

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptUrl: string;
  withdrawId: number;
  canDelete?: boolean;
  onDeleteSuccess?: () => void; // 삭제 성공 시 호출할 콜백
}

export default function ReceiptModal({
  isOpen,
  onClose,
  receiptUrl,
  withdrawId,
  canDelete = true,
  onDeleteSuccess,
}: ReceiptModalProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { removeReceipt, isLoading } = useReceipt(withdrawId, {
    onSuccess: () => {
      onClose();
      onDeleteSuccess?.(); // 삭제 성공 후 부모 컴포넌트에 알림
    },
    onError: (error) => {
      console.error('영수증 삭제 실패:', error);
      // 필요한 경우 에러 메시지를 표시할 수 있음
    },
    onDataChange: () => {
      // 필요한 경우 여기에서 추가 작업 수행
      onDeleteSuccess?.(); // 데이터 변경 시 부모 컴포넌트에 알림
    },
  });

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeReceipt();
      // 삭제 성공 시 처리는 onSuccess와 onDataChange에서 처리됨
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='영수증 확인'
      className={styles.modal}
    >
      {isConfirmOpen ? (
        <div className={styles.confirmContainer}>
          <p className={styles.confirmMessage}>영수증을 삭제하시겠습니까?</p>
          <div className={styles.confirmButtons}>
            <Button onClick={handleCancelDelete} variant='outline'>
              취소
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant='disabled'
              disabled={isLoading}
            >
              {isLoading ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            <Image
              src={receiptUrl}
              alt='영수증'
              fill
              className={styles.image}
              sizes='(max-width: 768px) 100vw, 500px'
            />
          </div>
          <div className={styles.footer}>
            <Button onClick={onClose} variant='outline'>
              닫기
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
