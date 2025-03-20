import React, { ButtonHTMLAttributes } from 'react';
import styles from './RoundButton.module.scss';

export type RoundButtonVariant = 'fill' | 'primary' | 'secondary' | 'disabled';

export interface RoundButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 디자인 변형
   * @default 'primary'
   */
  variant?: RoundButtonVariant;

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
  children: React.ReactNode;
}

/**
 * 둥근 형태의 버튼 컴포넌트
 */
const RoundButton: React.FC<RoundButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.roundButton,
    styles[`roundButton--${variant}`],
    isLoading ? styles['roundButton--loading'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {isLoading ? (
        <span className={styles.loader}></span>
      ) : (
        <span className={styles.content}>{children}</span>
      )}
    </button>
  );
};

export default RoundButton;
