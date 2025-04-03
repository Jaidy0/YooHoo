'use client';

import { useState, useEffect } from 'react';
import styles from './DogSelectModal.module.scss';
import IconBox from '@/components/common/IconBox/IconBox';
import Button from '@/components/common/buttons/Button/Button';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';

// 간소화된 강아지 데이터 인터페이스
interface Dog {
  id: string;
  name: string;
}

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
  const [dogList, setDogList] = useState<Dog[]>([]);
  const [selectedDogName, setSelectedDogName] = useState<string>('');

  // 강아지 목록 가져오기 (실제로는 API 호출)
  useEffect(() => {
    // 임시 데이터 (실제 구현 시에는 API 호출로 대체)
    const dogs: Dog[] = [
      { id: 'dog1', name: '럭키' },
      { id: 'dog2', name: '해피' },
      { id: 'dog3', name: '초코' },
      { id: 'dog4', name: '바둑이' },
      { id: 'dog5', name: '꼬미' },
    ];

    setDogList(dogs);

    // 초기 선택된 강아지 설정
    if (initialDogId) {
      const dog = dogs.find((d) => d.id === initialDogId);
      if (dog) setSelectedDogName(dog.name);
    }
  }, [initialDogId]);

  // 모달이 열리지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  // 강아지 선택 핸들러
  const handleDogSelect = (dog: Dog) => {
    setSelectedDogName(dog.name);
    setSelectedDogId(dog.id);
    setIsDropdownOpen(false);
  };

  // 금액 포맷팅
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
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
          {/* 지출 정보가 제공된 경우 표시 */}
          {expenseInfo && (
            <div className={styles.expenseInfo}>
              <div className={styles.expenseType}>{expenseInfo.type}</div>

              <div className={styles.expenseGrid}>
                <div className={styles.expenseItem}>
                  <span className={styles.label}>카테고리</span>
                  <span className={styles.value}>{expenseInfo.category}</span>
                </div>
                <div className={styles.expenseItem}>
                  <span className={styles.label}>금액</span>
                  <span className={styles.value}>
                    {formatAmount(expenseInfo.amount)}원
                  </span>
                </div>
                <div className={styles.expenseItem}>
                  <span className={styles.label}>날짜</span>
                  <span className={styles.value}>{expenseInfo.date}</span>
                </div>
                <div className={styles.expenseItem}>
                  <span className={styles.label}>내용</span>
                  <span className={styles.value}>{expenseInfo.content}</span>
                </div>
              </div>

              <div className={styles.separator}></div>
            </div>
          )}

          <label className={styles.label}>강아지 선택</label>

          {/* 간소화된 강아지 선택 드롭다운 */}
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
                {dogList.map((dog) => (
                  <div
                    key={dog.id}
                    className={`${styles.dropdownItem} ${selectedDogId === dog.id ? styles.selected : ''}`}
                    onClick={() => handleDogSelect(dog)}
                  >
                    <span>{dog.name}</span>
                  </div>
                ))}
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
