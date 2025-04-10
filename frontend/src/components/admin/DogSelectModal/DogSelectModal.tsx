'use client';

import { useState, useEffect } from 'react';
import styles from './DogSelectModal.module.scss';
import IconBox from '@/components/common/IconBox/IconBox';
import Button from '@/components/common/buttons/Button/Button';
import { useDogNames } from '@/hooks/useDogNames';
import { assignDogToWithdrawal } from '@/api/donations/donation';

interface DogSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialDogId?: string;
  withDrawId: number;
  onSuccess?: (dogId: number, dogName: string) => void; // 성공 콜백 추가
}

export default function DogSelectModal({
  isOpen,
  onClose,
  title,
  initialDogId = '',
  withDrawId,
  onSuccess,
}: DogSelectModalProps) {
  const [selectedDogId, setSelectedDogId] = useState<string>(initialDogId);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedDogName, setSelectedDogName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      // 모달 열릴 때 에러 상태 초기화
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, refetch]);

  // 모달이 열리지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 강아지 선택 핸들러
  const handleDogSelect = (dogId: number, name: string) => {
    setSelectedDogName(name);
    setSelectedDogId(dogId.toString());
    setIsDropdownOpen(false);
  };

  // 강아지 ID 할당 API 호출
  const handleSave = async () => {
    if (!selectedDogId || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const dogInfo = await assignDogToWithdrawal(
        withDrawId,
        parseInt(selectedDogId, 10)
      );
      console.log('강아지 할당 성공:', dogInfo);

      // 성공 시 콜백 호출 (있는 경우)
      if (onSuccess) {
        onSuccess(parseInt(selectedDogId, 10), selectedDogName);
      }

      onClose();
    } catch (err) {
      console.error('강아지 할당 중 오류 발생:', err);
      setSubmitError('강아지 할당에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
                      className={`${styles.dropdownItem} ${
                        selectedDogId === dog.dogId.toString()
                          ? styles.selected
                          : ''
                      }`}
                      onClick={() => handleDogSelect(dog.dogId, dog.name)}
                    >
                      <span>{dog.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 제출 에러 메시지 */}
          {submitError && (
            <div className={styles.errorMessage}>{submitError}</div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            variant='primary'
            size='md'
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!selectedDogId || isSubmitting}
          >
            {isSubmitting ? '처리 중...' : '선택 완료'}
          </Button>
        </div>
      </div>
    </div>
  );
}
