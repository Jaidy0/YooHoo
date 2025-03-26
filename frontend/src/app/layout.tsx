import { ReactNode } from 'react';
import styles from './layout.module.scss';
import '@/assets/styles/globals.scss';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body className={styles.body}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
