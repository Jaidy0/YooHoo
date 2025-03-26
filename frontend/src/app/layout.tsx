import { ReactNode, useEffect } from 'react';
import styles from './layout.module.scss';
import '@/assets/styles/globals.scss';

export default function MainLayout({ children }: { children: ReactNode }) {
  // 클라이언트 측에서만 MSW 초기화
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks').then((module) => module.default());
    }
  }, []);
  return (
    <html lang='ko'>
      <body className={styles.body}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
