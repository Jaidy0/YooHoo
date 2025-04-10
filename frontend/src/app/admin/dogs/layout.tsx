'use client';

import { ReactNode } from 'react';
import styles from './layout.module.scss';

export default function DogsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.dogsLayout}>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
}
