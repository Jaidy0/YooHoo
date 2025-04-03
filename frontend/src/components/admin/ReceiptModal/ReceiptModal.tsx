import React from 'react';
import Modal from '@/components/common/Modal/Modal';
import styles from './ReceiptModal.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptUrl?: string;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  receiptUrl = '',
}: ReceiptModalProps) {
  const handleDownload = () => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='영수증'>
      <div className={styles.receiptContainer}>
        {receiptUrl ? (
          <>
            <div className={styles.previewContainer}>
              {receiptUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img
                  src={receiptUrl}
                  alt='영수증'
                  className={styles.receiptPreview}
                />
              ) : receiptUrl.match(/\.(pdf)$/i) ? (
                <iframe
                  src={`${receiptUrl}#toolbar=0&navpanes=0`}
                  className={styles.receiptPreview}
                  title='영수증 PDF'
                />
              ) : (
                <div className={styles.fileIcon}>
                  <span className={styles.fileName}>
                    {receiptUrl.split('/').pop() || '영수증 파일'}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <RoundButton variant='primary' onClick={handleDownload}>
                다운로드
              </RoundButton>
              <RoundButton variant='secondary' onClick={onClose}>
                닫기
              </RoundButton>
            </div>
          </>
        ) : (
          <div className={styles.noReceipt}>
            <p>영수증이 없습니다.</p>
            <div className={styles.buttonContainer}>
              <RoundButton variant='secondary' onClick={onClose}>
                닫기
              </RoundButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
