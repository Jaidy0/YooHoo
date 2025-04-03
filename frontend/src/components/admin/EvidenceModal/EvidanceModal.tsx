import React from 'react';
import Modal from '@/components/common/Modal/Modal';
import styles from './EvidanceModal.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

interface EvidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceUrl?: string;
}

export default function EvidanceModal({
  isOpen,
  onClose,
  evidenceUrl = '',
}: EvidanceModalProps) {
  const handleDownload = () => {
    if (evidenceUrl) {
      window.open(evidenceUrl, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='증빙자료'>
      <div className={styles.evidenceContainer}>
        {evidenceUrl ? (
          <>
            <div className={styles.previewContainer}>
              {evidenceUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img
                  src={evidenceUrl}
                  alt='증빙자료'
                  className={styles.evidencePreview}
                />
              ) : evidenceUrl.match(/\.(pdf)$/i) ? (
                <iframe
                  src={`${evidenceUrl}#toolbar=0&navpanes=0`}
                  className={styles.evidencePreview}
                  title='증빙자료 PDF'
                />
              ) : (
                <div className={styles.fileIcon}>
                  <span className={styles.fileName}>
                    {evidenceUrl.split('/').pop() || '증빙파일'}
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
          <div className={styles.noEvidence}>
            <p>증빙자료가 없습니다.</p>
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
