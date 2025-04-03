'use client';

import { useState, useEffect } from 'react';
import styles from './DogSelectModal.module.scss';
import IconBox from '@/components/common/IconBox/IconBox';
import Button from '@/components/common/buttons/Button/Button';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import { useDogNames } from '@/hooks/useDogNames';

interface DogSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialDogId?: string;
  onSave: (selectedDogId: string) => void;
  expenseInfo?: {
    type: string;
    category: string;
    amount: number;
    date: string;
    content: string;
    isEvidence: boolean;
    isReceipt: boolean;
  };
  onEvidenceClick?: () => void;
  onReceiptClick?: () => void;
}

export default function DogSelectModal({
  isOpen,
  onClose,
  title,
  initialDogId = '',
  onSave,
  expenseInfo,
  onEvidenceClick,
  onReceiptClick,
}: DogSelectModalProps) {
  const [selectedDogId, setSelectedDogId] = useState(initialDogId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDogName, setSelectedDogName] = useState<string>('');

  // 커스텀 훅 사용
  const { dogNames, isLoading, error, refetch } = useDogNames();

  // 초기 선택된 강아지 설정
  useEffect(() => {
    if (initialDogId && dogNames.length > 0) {
      const dog = dogNames.find((d) => d.dogId.toString() === initialDogId);
      if (dog) setSelectedDogName(dog.name);
    }
  }, [initialDogId, dogNames]);

  // 모달이 열릴 때 데이터 리프레시 - 한 번만 호출되도록 isOpen 상태 변화 감지
  useEffect(() => {
    // isOpen이 true로 변경될 때만 refetch 호출
    if (isOpen) {
      refetch();
    }
  }, [isOpen]); // refetch 의존성 제거

  // 모달이 열리지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 강아지 선택 핸들러
  const handleDogSelect = (dogId: number, name: string) => {
    setSelectedDogName(name);
    setSelectedDogId(dogId.toString());
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>{title}</span>
          <button className={styles.closeButton} onClick={onClose}>
            <IconBox name='circleX' size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <label className={styles.label}>강아지 선택</label>

          {/* 강아지 선택 드롭다운 */}
          <div className={styles.dropdownContainer}>
            <div
              className={styles.dropdownHeader}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedDogName ? (
                <span>{selectedDogName}</span>
              ) : (
                <span className={styles.placeholder}>
                  강아지를 선택해주세요
                </span>
              )}
              <IconBox name='chevron' size={16} />
            </div>

            {isDropdownOpen && (
              <div className={styles.dropdownList}>
                {isLoading ? (
                  <div className={styles.loadingMessage}>로딩 중...</div>
                ) : error ? (
                  <div className={styles.errorMessage}>{error}</div>
                ) : dogNames.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    등록된 강아지가 없습니다
                  </div>
                ) : (
                  dogNames.map((dog) => (
                    <div
                      key={dog.dogId}
                      className={`${styles.dropdownItem} ${selectedDogId === dog.dogId.toString() ? styles.selected : ''}`}
                      onClick={() => handleDogSelect(dog.dogId, dog.name)}
                    >
                      <span>{dog.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 증빙자료/영수증 버튼 그룹 */}
          {(onEvidenceClick || onReceiptClick) && (
            <div className={styles.buttonGroup}>
              {onEvidenceClick && expenseInfo?.isEvidence && (
                <RoundButton variant='secondary' onClick={onEvidenceClick}>
                  증빙자료 보기
                </RoundButton>
              )}

              {onReceiptClick && expenseInfo?.isReceipt && (
                <RoundButton variant='secondary' onClick={onReceiptClick}>
                  영수증 보기
                </RoundButton>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            variant='primary'
            size='md'
            className={styles.saveButton}
            onClick={() => {
              if (selectedDogId) {
                onSave(selectedDogId);
                onClose();
              }
            }}
            disabled={!selectedDogId}
          >
            선택 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
