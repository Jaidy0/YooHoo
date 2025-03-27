'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './TabMenu.module.scss';

// 인터페이스 정의
export interface TabMenuItem {
  /**
   * 메뉴 아이템의 이름
   */
  name: string;

  /**
   * 메뉴 아이템 클릭 시 이동할 링크
   */
  link: string;

  /**
   * 메뉴 아이템 활성화 여부 (선택 사항)
   * @default false
   */
  isActive?: boolean;
}

export interface TabMenuProps {
  /**
   * 탭 메뉴 아이템 목록
   */
  menuItems: TabMenuItem[];

  /**
   * 기본 선택될 메뉴 아이템의 인덱스
   * @default 0
   */
  defaultActiveIndex?: number;

  /**
   * 메뉴 아이템 클릭 시 실행될 핸들러
   */
  onMenuItemClick?: (item: TabMenuItem, index: number) => void;

  /**
   * 탭 메뉴의 너비를 100%로 설정할지 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 탭 메뉴 크기
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

export default function TabMenu({
  menuItems = [],
  defaultActiveIndex = 0,
  onMenuItemClick,
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}: TabMenuProps) {
  const [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex);
  const pathname = usePathname();

  // 경로가 변경될 때마다 활성 탭 인덱스 업데이트
  useEffect(() => {
    // 현재 경로와 가장 일치하는 메뉴 아이템 찾기
    const index = menuItems.findIndex(
      (item) =>
        pathname === item.link ||
        (item.link !== '/admin' && pathname.startsWith(item.link))
    );

    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname, menuItems]);

  // 나머지 코드는 그대로 유지
  const handleItemClick = (item: TabMenuItem, index: number) => {
    setActiveIndex(index);
    onMenuItemClick?.(item, index);
  };

  const tabMenuClasses = [
    styles.tabMenu,
    styles[`tabMenu--${size}`],
    fullWidth ? styles['tabMenu--fullWidth'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={tabMenuClasses} {...props}>
      <ul className={styles.menuList}>
        {menuItems.map((item, index) => {
          const isActive = index === activeIndex;
          const itemClasses = [
            styles.menuItem,
            isActive ? styles['menuItem--active'] : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li key={`tab-menu-item-${index}`} className={itemClasses}>
              <a
                href={item.link}
                className={styles.menuLink}
                onClick={(e) => {
                  if (onMenuItemClick) {
                    e.preventDefault();
                    handleItemClick(item, index);
                  }
                }}
              >
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
