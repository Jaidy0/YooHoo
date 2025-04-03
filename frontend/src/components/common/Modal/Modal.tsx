import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string; // className 속성 추가 (선택적)
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '', // 기본값 설정
}: ModalProps) {
  // 모달 DOM 요소 참조
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키 누를 때 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 모달 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={`${styles.modal} ${className}`}
        ref={modalRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
      >
        <div className={styles.header}>
          <h3 className={styles.title} id='modal-title'>
            {title}
          </h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='닫기'
          >
            &times;
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
