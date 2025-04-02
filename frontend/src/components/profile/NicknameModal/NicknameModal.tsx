'use client';

import styles from './NicknameModal.module.scss';
import { useState } from 'react';
import IconBox from '@/components/common/IconBox/IconBox';
import Button from '@/components/common/buttons/Button/Button'; // 추가

interface Props {
  initialValue: string;
  onClose: () => void;
  onSave: (newNickname: string) => void;
}

export default function NicknameModal({
  initialValue,
  onClose,
  onSave,
}: Props) {
  const [nickname, setNickname] = useState(initialValue);

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
        <Button
          variant='primary'
          size='md'
          className={styles.saveButton}
          onClick={() => onSave(nickname)}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
