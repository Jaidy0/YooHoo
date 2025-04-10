'use client';

import styles from './NicknameModal.module.scss';
import { useState } from 'react';
import IconBox from '@/components/common/IconBox/IconBox';
import Button from '@/components/common/buttons/Button/Button';
import { useUpdateNickname } from '@/hooks/user/useUpdateNickname';

interface Props {
  initialValue: string;
  onClose: () => void;
}

export default function NicknameModal({ initialValue, onClose }: Props) {
  const [nickname, setNickname] = useState(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { updateNickname, isLoading, error } = useUpdateNickname();

  const validateNickname = (value: string): boolean => {
    if (!value.trim()) {
      setValidationError('닉네임을 입력해주세요.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateNickname(nickname)) {
      return;
    }

    const success = await updateNickname(nickname);

    if (success) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span>내 정보 수정</span>
          <button className={styles.closeButton} onClick={onClose}>
            <IconBox name='circleX' size={20} />
          </button>
        </div>
        <label className={styles.label}>닉네임 수정</label>
        <input
          className={styles.input}
          type='text'
          placeholder='닉네임을 입력해주세요.'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        {/* 유효성 검사 에러 표시 */}
        {validationError && (
          <p className={styles.errorMessage}>{validationError}</p>
        )}

        {/* API 에러 표시 */}
        {error && (
          <p className={styles.errorMessage}>닉네임 수정에 실패했습니다</p>
        )}

        <Button
          variant='primary'
          size='md'
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  );
}
