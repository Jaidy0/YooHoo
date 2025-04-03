import React from 'react';
import Modal from '@/components/common/Modal/Modal';
import styles from './EvidanceModal.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

interface EvidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawId: number;
}

export default function EvidanceModal({
  isOpen,
  onClose,
  withdrawId,
}: EvidanceModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='증빙자료'>
      <div className={styles.evidenceContainer}>
        <>
          <div className={styles.previewContainer}></div>
          <div className={styles.buttonContainer}>
            <RoundButton variant='secondary' onClick={onClose}>
              닫기
            </RoundButton>
          </div>
        </>
      </div>
    </Modal>
  );
}
