// components/layout/Header/Header.tsx
import React from 'react';
import styles from './Header.module.scss';
import logo from '@/assets/imgs/yoohoo-logo.svg';
import IconBox from '../IconBox/IconBox';
import Image from 'next/image';

export type HeaderType = 'main' | 'sub';

interface HeaderProps {
  title: string;
  type: HeaderType;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
}

export default function Header({
  title,
  type,
  onBackClick,
  onNotificationClick,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {type === 'sub' && (
          <button onClick={onBackClick} className={styles.iconButton}>
            <IconBox name='arrow' size={24} />
          </button>
        )}
        {type === 'main' && (
          <Image
            src='/images/yoohoo-logo.svg'
            alt='유후 Logo'
            width={100} // 로고의 실제 너비로 조정하세요
            height={32} // 로고의 실제 높이로 조정하세요
            className={styles.logo}
            priority // 로고는 중요한 요소이므로 우선 로딩
          />
        )}
      </div>
      {type === 'sub' && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.right}>
        {type === 'main' && (
          <button onClick={onNotificationClick} className={styles.iconButton}>
            <IconBox name='bell' size={24} color='#555' />
          </button>
        )}
      </div>
    </header>
  );
}
