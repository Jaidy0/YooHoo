'use client';

import styles from './Input.module.scss';
import React from 'react';

export interface InputProps {
  /**
   * 입력 필드 제목
   * @default '제목'
   */
  title: string;

  /**
   * 플레이스 홀더
   * @default '검색어를 입력하세요'
   */
  placeHolder: string;

  /**
   * 활성화 여부
   * @default true
   */
  isAvail?: boolean;

  /**
   * 입력 필드 너비
   * @default '100%
   */
  width?: string | number;

  /**
   * 에러 메시지
   * @default ''
   */
  errorMessage?: string;

  /**
   * 에러 상태 여부
   * @default false
   */
  hasError?: boolean;

  /**
   * 입력값 변경 이벤트 핸들러
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * 입력 필드 값
   */
  value?: string;

  /**
   * 입력 필드 타입
   * @default 'text'
   */
  type?: string;
}

export default function Input({
  title = '제목',
  placeHolder = '검색어를 입력하세요',
  isAvail = true,
  width = '100%',
  errorMessage = '',
  hasError = false,
  onChange,
  value,
  type = 'text',
}: InputProps) {
  const inputWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel}>{title}</label>
      <input
        type={type}
        placeholder={placeHolder}
        disabled={!isAvail}
        className={`${styles.inputField} ${hasError ? styles.inputError : ''}`}
        style={{ width: inputWidth }}
        onChange={onChange}
        value={value}
      />
      {hasError && errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
}
