import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 디자인 변형
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * 버튼 크기
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * 너비 100% 적용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 로딩 상태 표시 여부
   * @default false
   */
  isLoading?: boolean;

  /**
   * 버튼 왼쪽에 표시할 아이콘
   */
  leftIcon?: React.ReactNode;

  /**
   * 버튼 오른쪽에 표시할 아이콘
   */
  rightIcon?: React.ReactNode;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 버튼 내용
   */
  children: React.ReactNode;
}

/**
 * 유기견 후원 플랫폼의 기본 버튼 컴포넌트
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth ? styles['button--fullWidth'] : '',
    isLoading ? styles['button--loading'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
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
};

export default Button;
