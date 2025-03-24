import React from 'react';
import styles from './Badge.module.scss';

export type BadgeVariant = 'positive' | 'negative';

export interface BadgeProps {
  /**
   * 버튼 디자인 변형
   * @default 'positive'
   */
  variant?: BadgeVariant;

  /**
   * 버튼 너비 - 직접 지정
   */
  width?: string | number;

  /**
   * 버튼 높이 - 직접 지정
   */
  height?: string | number;

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
