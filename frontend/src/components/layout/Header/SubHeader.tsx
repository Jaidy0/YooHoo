import React from 'react';
import styles from './Header.module.scss';
import IconBox from '@/components/common/IconBox/IconBox';

interface SubHeaderProps {
  title: string;
  onBackClick?: () => void;
}

export default function SubHeader({ title, onBackClick }: SubHeaderProps) {
  return (
    <header className={styles.subHeader}>
      <div className={styles.left}>
        <button onClick={onBackClick} className={styles.iconButton}>
          <IconBox name='arrow' size={24} />
        </button>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}></div>
    </header>
  );
}
