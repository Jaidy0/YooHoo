import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './MoveButton.module.scss';

export type MoveButtonVariant = 'primary' | 'secondary';

export interface MoveButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 디자인 변형 (색상)
   * @default 'primary'
   */
  variant?: MoveButtonVariant;

  /**
   * 버튼 왼쪽에 표시할 아이콘
   */
  leftIcon?: ReactNode;

  /**
   * 버튼 오른쪽에 표시할 아이콘
   */
  rightIcon?: ReactNode;

  /**
   * 로딩 상태 표시 여부
   * @default false
   */
  isLoading?: boolean;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 버튼 내용
   */
  children: ReactNode;
}

/**
 * 페이지 이동을 위한 버튼 컴포넌트
 */
export default function MoveButton({
  children,
  variant = 'primary',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  ...props
}: MoveButtonProps) {
  const buttonClasses = [
    styles.moveButton,
    styles[`moveButton--${variant}`],
    isLoading ? styles['moveButton--loading'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {isLoading && <span className={styles.loader}></span>}

      {!isLoading && leftIcon && (
        <span className={styles.leftIcon}>{leftIcon}</span>
      )}

      <span className={styles.content}>{children}</span>

      {!isLoading && rightIcon && (
        <span className={styles.rightIcon}>{rightIcon}</span>
      )}
    </button>
  );
}