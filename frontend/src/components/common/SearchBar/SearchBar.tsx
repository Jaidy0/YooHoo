'use client';

import React, { useState, useRef, FormEvent } from 'react';
import styles from './SearchBar.module.scss';
import IconBox from '@/components/common/IconBox/IconBox';

interface SearchBoxProps {
  /** 검색창 placeholder 텍스트 */
  placeholder?: string;
  /** 초기 검색어 */
  initialValue?: string;
  /** 검색 제출 핸들러 */
  onSearch?: (searchTerm: string) => void;
  /** 검색창 너비 스타일 */
  fullWidth?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

export default function SearchBar({
  placeholder = '찾으시는 단체 이름을 입력해주세요.',
  initialValue = '',
  onSearch,
  fullWidth = false,
  className = '',
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm); // 검색어가 빈 문자열이어도 onSearch 호출
    }
    // 모바일에서 검색 후 키보드 닫기
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch(''); // 빈 검색어로 onSearch 호출
    }
    inputRef.current?.focus();
  };

  return (
    <form
      className={`${styles.searchBox} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        type='text'
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label='검색'
      />

      {searchTerm && (
        <button
          type='button'
          className={styles.clearButton}
          onClick={handleClear}
          aria-label='검색어 지우기'
        >
          <span className={styles.clearIcon}>×</span>
        </button>
      )}

      <button
        type='submit'
        className={styles.searchButton}
        aria-label='검색하기'
      >
        <IconBox name='search' size={24} color='#FFA000' />
      </button>
    </form>
  );
}
