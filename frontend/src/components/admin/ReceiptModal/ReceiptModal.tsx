import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ReceiptModal.module.scss';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/buttons/Button/Button';
import { getReceiptFileUrl } from '@/api/donations/receipt';

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawId: number;
  canDelete?: boolean;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  withdrawId,
}: ReceiptModalProps) {
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 영수증 파일 URL 조회
  useEffect(() => {
    if (!isOpen) return;

    const fetchReceiptUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const url = await getReceiptFileUrl(withdrawId);
        setReceiptUrl(url);
      } catch (err) {
        console.error('영수증 이미지 URL 조회 실패:', err);
        setError('영수증 이미지를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptUrl();
  }, [isOpen, withdrawId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='영수증 확인'
      className={styles.modal}
    >
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <p>영수증 이미지를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        ) : (
          <div className={styles.imageContainer}>
            <Image
              src={receiptUrl}
              alt='영수증'
              fill
              className={styles.image}
              sizes='(max-width: 768px) 100vw, 500px'
            />
          </div>
        )}

        <div className={styles.footer}>
          <Button onClick={onClose} variant='outline'>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
