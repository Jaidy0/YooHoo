import { useState, useRef, useEffect } from 'react';
import styles from './DropDown.module.scss';
import IconBox from '../IconBox/IconBox';

export interface DropDownOption {
  /**
   * 옵션의 고유 식별자
   */
  value: string;

  /**
   * 화면에 표시될 옵션 텍스트
   */
  label: string;
}

export interface DropDownProps {
  /**
   * 드롭다운에 표시될 기본 텍스트
   */
  placeholder?: string;

  /**
   * 드롭다운 옵션 목록
   */
  options: DropDownOption[];

  /**
   * 현재 선택된 값
   */
  value?: string;

  /**
   * 값 변경 시 호출되는 함수
   */
  onChange?: (value: string) => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * 드롭다운 컴포넌트
 */
export default function DropDown({
  placeholder = '선택',
  options,
  value,
  onChange,
  className = '',
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 선택된 옵션 찾기
  const selectedOption = options.find((option) => option.value === value);

  // 드롭다운 토글
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  // 옵션 선택 처리
  function handleOptionSelect(optionValue: string) {
    onChange?.(optionValue);
    setIsOpen(false);
  }

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropdownClasses = [
    styles.dropdown,
    isOpen ? styles['dropdown--open'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={dropdownClasses} ref={dropdownRef}>
      <button
        type='button'
        className={styles.dropdownToggle}
        onClick={toggleDropdown}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className={styles.dropdownArrow}>
          <IconBox name='chevron' size={20} />
        </span>
      </button>

      <ul className={styles.dropdownMenu} role='listbox'>
        {isOpen &&
          options.map((option) => (
            <li
              key={option.value}
              className={`${styles.dropdownOption} ${
                option.value === value ? styles['dropdownOption--selected'] : ''
              }`}
              onClick={() => handleOptionSelect(option.value)}
              role='option'
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
