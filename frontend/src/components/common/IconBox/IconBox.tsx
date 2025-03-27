'use client';

import React from 'react';
import styles from './IconBox.module.scss';

import ArrowIcon from '@/assets/imgs/icons/iconArrow.svg';
import BellIcon from '@/assets/imgs/icons/iconBell.svg';
import BoneIcon from '@/assets/imgs/icons/iconBone.svg';
import CalendarIcon from '@/assets/imgs/icons/iconCalendar.svg';
import CartIcon from '@/assets/imgs/icons/iconCart.svg';
import ChevronIcon from '@/assets/imgs/icons/iconChevron.svg';
import DogIcon from '@/assets/imgs/icons/iconDog.svg';
import DogheadIcon from '@/assets/imgs/icons/iconDoghead.svg';
import DownloadIcon from '@/assets/imgs/icons/iconDownload.svg';
import HeartIcon from '@/assets/imgs/icons/iconHeart.svg';
import HomeIcon from '@/assets/imgs/icons/iconHome.svg';
import PetfootIcon from '@/assets/imgs/icons/iconPetfoot.svg';
import ShareIcon from '@/assets/imgs/icons/iconShare.svg';
import GearIcon from '@/assets/imgs/icons/iconGear.svg';
import iconCircleX from '@/assets/imgs/icons/iconCircleX.svg';
import iconZoom from '@/assets/imgs/icons/iconZoom.svg';
import iconSearch from '@/assets/imgs/icons/iconSearch.svg';
import iconHandshake from '@/assets/imgs/icons/iconHandshake.svg';
import iconCutiDog from '@/assets/imgs/icons/iconCutiDog.svg';

// 아이콘 컴포넌트 매핑 객체
const ICON_COMPONENTS = {
  arrow: ArrowIcon,
  bell: BellIcon,
  bone: BoneIcon,
  calendar: CalendarIcon,
  cart: CartIcon,
  chevron: ChevronIcon,
  dog: DogIcon,
  doghead: DogheadIcon,
  download: DownloadIcon,
  heart: HeartIcon,
  home: HomeIcon,
  petfoot: PetfootIcon,
  share: ShareIcon,
  gear: GearIcon,
  circleX: iconCircleX,
  zoom: iconZoom,
  search: iconSearch,
  handShake: iconHandshake,
  cutiDog: iconCutiDog,
} as const;

// 아이콘 이름 타입
export type IconName = keyof typeof ICON_COMPONENTS;

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
  size,
  color,
  className = '',
  onClick,
}) => {
  // 아이콘 컴포넌트 가져오기
  const IconComponent = ICON_COMPONENTS[name];

  if (!IconComponent) {
    console.warn(`Icon with name "${name}" not found`);
    return null;
  }

  return (
    <div
      className={`${styles.icon} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <IconComponent
        width={size}
        height={size}
        style={{
          color: color,
        }}
      />
    </div>
  );
};

export default IconBox;
