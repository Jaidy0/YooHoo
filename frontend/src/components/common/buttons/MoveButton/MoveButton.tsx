import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './MoveButton.module.scss';
import { IconProps } from '../../IconBox/IconBox';

export type MoveButtonVariant = 'primary' | 'secondary' | 'yellow';

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

  // variant에 따른 아이콘 색상 결정
  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return '#ff544c'; // $yh-orange 색상값
      case 'secondary':
        return 'white';
      case 'yellow':
        return 'black';
      default:
        return '#ff544c';
    }
  };

  // 아이콘에 색상 적용하기 위한 함수
  const cloneIconWithColor = (icon: ReactNode) => {
    if (!icon || !React.isValidElement(icon)) return icon;

    // IconProps 타입을 가진 props가 있는지 확인
    const iconElement = icon as React.ReactElement<IconProps>;

    // 기존 props를 유지하면서 color 속성 추가
    return React.cloneElement(iconElement, {
      ...iconElement.props,
      color: getIconColor(),
    });
  };

  return (
    <button className={buttonClasses} {...props}>
      {isLoading && <span className={styles.loader}></span>}

      {!isLoading && leftIcon && (
        <span className={styles.leftIcon}>{cloneIconWithColor(leftIcon)}</span>
      )}

      <span className={styles.content}>{children}</span>

      {!isLoading && rightIcon && (
        <span className={styles.rightIcon}>
          {cloneIconWithColor(rightIcon)}
        </span>
      )}
    </button>
  );
}
