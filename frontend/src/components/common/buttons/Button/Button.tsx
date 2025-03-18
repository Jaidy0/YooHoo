import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'outline' | 'disabled';
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
   * 버튼 너비 - 직접 지정
   */
  width?: string | number;

  /**
   * 버튼 높이 - 직접 지정
   */
  height?: string | number;

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
  width,
  height,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  style,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    isLoading ? styles['button--loading'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // 사용자 지정 스타일 (너비/높이)
  const customStyle = {
    ...style,
    ...(width !== undefined && {
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    ...(height !== undefined && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
  };

  return (
    <button className={buttonClasses} style={customStyle} {...props}>
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
