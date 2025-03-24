'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.scss';
import IconBox, { IconName } from '../IconBox/IconBox';

export type BottomNavItem = {
  label: string;
  iconName: IconName;
  href: string;
};

export interface BottomNavProps {
  items: BottomNavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNav}>
      <ul className={styles.navList}>
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <li key={index} className={styles.navItem}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.iconWrapper}>
                  <IconBox
                    name={item.iconName}
                    size={24}
                    color={isActive ? '#FF5722' : '#9E9E9E'}
                  />
                </div>
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
