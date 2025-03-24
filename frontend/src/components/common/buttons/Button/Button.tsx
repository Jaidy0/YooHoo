import { ButtonHTMLAttributes, ReactNode } from 'react';
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
   * 버튼 왼쪽에 표시할 아이콘
   */
  leftIcon?: ReactNode;

  /**
   * 버튼 오른쪽에 표시할 아이콘
   */
  rightIcon?: ReactNode;

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
 * 유기견 후원 플랫폼의 기본 버튼 컴포넌트
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  width,
  height,
  leftIcon,
  rightIcon,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
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

  // variant가 'disabled'인 경우 disabled 속성 추가
  const buttonProps = {
    ...props,
    ...(variant === 'disabled' && { disabled: true }),
  };

  return (
    <button className={buttonClasses} style={customStyle} {...buttonProps}>
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={styles.content}>{children}</span>
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
}
