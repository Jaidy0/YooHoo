import React from 'react';
import styles from './Badge.module.scss';

export type BadgeVariant = 'positive' | 'negative';

export interface BadgeProps {
  /**
   * 뱃지 디자인 변형
   * @default 'positive'
   */
  variant?: BadgeVariant;

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
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'positive',
  width,
  height,
  className = '',
  ...props
}) => {
  const badgeClasses = [styles.badge, styles[`badge--${variant}`], className]
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
    <div className={badgeClasses} style={customStyle} {...props}>
      <span className={styles.content}>{children}</span>
    </div>
  );
};

export default Badge;
