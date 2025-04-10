import { ReactNode } from 'react';
import styles from './SelectCard.module.scss';

export type BorderType = 'default' | 'gray' | 'none';

export interface SelectCardProps {
  /** 카드 제목 */
  title: string;

  /** 카드 설명 */
  description?: string;

  /** 아이콘 요소 */
  icon?: ReactNode;

  /** 테두리 유형 */
  borderType?: BorderType;

  /** 선택 여부 */
  isSelected?: boolean;

  /** 선택 시 테두리 숨김 여부 */
  noBorderOnSelect?: boolean;

  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;

  /** 추가 클래스명 */
  className?: string;
}

export default function SelectCard({
  title,
  description,
  icon,
  borderType = 'default',
  isSelected = false,
  noBorderOnSelect = false,
  onClick,
  className = '',
}: SelectCardProps) {
  function getBorderClass() {
    switch (borderType) {
      case 'gray':
        return styles.grayBorder;
      case 'none':
        return styles.noBorder;
      default:
        return styles.defaultBorder;
    }
  }

  return (
    <div
      className={`
        ${styles.selectCard} 
        ${getBorderClass()} 
        ${isSelected ? styles.selected : ''} 
        ${isSelected && noBorderOnSelect ? styles.noBorderOnSelect : ''} 
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <div className={styles.iconContainer}>{icon}</div>}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
