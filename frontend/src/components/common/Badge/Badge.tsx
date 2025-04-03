import React from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps {
  /**
   * 뱃지 디자인 변형
   * @default 'positive'
   */
  variant?: 'positive' | 'negative';

  /**
   * 뱃지 너비 - 직접 지정
   */
  width?: string | number;

  /**
   * 뱃지 높이 - 직접 지정
   */
  height?: string | number;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 뱃지 내용
   */
  children: React.ReactNode;

  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: () => void;
}

export default function Badge({
  children,
  variant = 'positive',
  width,
  height,
  className = '',
  onClick,
}: BadgeProps) {
  const badgeClasses = [
    styles.badge,
    styles[`badge--${variant}`],
    className,
    onClick ? styles.clickable : '',
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle = {
    ...(width !== undefined && {
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    ...(height !== undefined && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
  };

  return (
    <div
      className={badgeClasses}
      style={customStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className={styles.content}>{children}</span>
    </div>
  );
}
