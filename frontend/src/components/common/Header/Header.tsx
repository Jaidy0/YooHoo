// components/layout/Header/Header.tsx
import React from 'react';
import styles from './Header.module.scss';
import IconBox from '../IconBox/IconBox';
import logo from '@/assets/imgs/yoohoo-logo.svg';

export type HeaderType = 'main' | 'sub';

interface HeaderProps {
  title: string;
  type: HeaderType;
  onBackClick?: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  type,
  onBackClick, 
  onNotificationClick 
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {type === 'sub' && onBackClick && (
          <button onClick={onBackClick} className={styles.iconButton}>
            <IconBox name="iconArrow" size={24} />
          </button>
        )}
        {type === 'main' && onNotificationClick && (
          <img src="/yoohoo-logo.svg" alt="유후 Logo" className={styles.logo} /> 
        )}
      </div>
      {type === 'sub' && onBackClick && (
        <h1 className={styles.title}>{title}</h1>
        )}
      <div className={styles.right}>
        {type === 'main' && onNotificationClick && (
          <button onClick={onNotificationClick} className={styles.iconButton}>
            <IconBox name="iconBell" size={24} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;