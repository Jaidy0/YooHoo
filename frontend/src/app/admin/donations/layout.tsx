'use client';

import { ReactNode } from 'react';
import styles from './layout.module.scss';

export default function DonationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.donationsLayout}>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
}
