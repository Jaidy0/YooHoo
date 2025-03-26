import React from 'react';
import styles from './Header.module.scss';
import IconBox from '@/components/common/IconBox/IconBox';
import Image from 'next/image';
import Link from 'next/link';

interface MainHeaderProps {
  onNotificationClick?: () => void;
}

export function MainHeader({ onNotificationClick }: MainHeaderProps) {
  return (
    <header className={styles.mainHeader}>
      <div className={styles.left}>
        <Link href='/main' className={styles.logoLink}>
          <Image
            src='/images/yoohoo-logo.svg'
            alt='유후 Logo'
            width={100}
            height={32}
            className={styles.logo}
            priority
          />
        </Link>
      </div>
      <div className={styles.right}>
        <button onClick={onNotificationClick} className={styles.iconButton}>
          <IconBox name='bell' size={24} color='#555' />
        </button>
      </div>
    </header>
  );
}
