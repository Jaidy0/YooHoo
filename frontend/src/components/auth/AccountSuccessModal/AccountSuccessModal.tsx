// src/components/common/AccountSuccessModal/AccountSuccessModal.tsx
import React from 'react';
import styles from './AccountSuccessModal.module.scss';

interface AccountSuccessModalProps {
  isOpen: boolean;
}

const AccountSuccessModal: React.FC<AccountSuccessModalProps> = ({
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.emoji}>🐶</span>
        <h2 className={styles.title}> 계좌 생성 성공 !</h2>
        <p className={styles.desc}>이제 즐겁고 투명하게 YooHoo ~ 하세요 ☺️!</p>
        <p className={styles.subDesc}>잠시 후 메인페이지로 이동합니다.</p>
      </div>
    </div>
  );
};

export default AccountSuccessModal;
