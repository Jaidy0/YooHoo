import React from 'react';
import styles from './IconBox.module.scss';
import iconArrow from '../../../assets/imgs/icons/iconArrow.svg';
import iconBell from '../../../assets/imgs/icons/iconBell.svg';
import iconBone from '../../../assets/imgs/icons/iconBone.svg';
import iconCalendar from '../../../assets/imgs/icons/iconCalendar.svg';
import iconCart from '../../../assets/imgs/icons/iconCart.svg';
import iconChevron from '../../../assets/imgs/icons/iconChevron.svg';
import iconDog from '../../../assets/imgs/icons/iconDog.svg';
import iconDoghead from '../../../assets/imgs/icons/iconDoghead.svg';
import iconDownload from '../../../assets/imgs/icons/iconDownload.svg';
import iconHeart from '../../../assets/imgs/icons/iconHeart.svg';
import iconHome from '../../../assets/imgs/icons/iconHome.svg';
import iconPetfoot from '../../../assets/imgs/icons/iconPetfoot.svg';
import iconShare from '../../../assets/imgs/icons/iconShare.svg';

// 아이콘 맵 객체 생성
const iconMap = {
  iconArrow,
  iconBell,
  iconBone,
  iconCalendar,
  iconCart,
  iconChevron,
  iconDog,
  iconDoghead,
  iconDownload,
  iconHeart,
  iconHome,
  iconPetfoot,
  iconShare,
};

export type IconName = keyof typeof iconMap;

export interface IconProps {
  /** 아이콘 이름 */
  name: IconName;
  /** 아이콘 크기 (px) */
  size?: number;
  /** 아이콘 색상 */
  color?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
}

export const IconBox: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`${styles.icon} ${className}`}
      style={{
        width: size,
        height: size,
        color: color,
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          maskImage: `url(${iconMap[name].src})`,
          WebkitMaskImage: `url(${iconMap[name].src})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          backgroundColor: color || 'currentColor',
        }}
      />
    </div>
  );
};

export default IconBox;
