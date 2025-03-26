// app/(main)/layout.tsx
import Header from '@/components/layout/Header/Header';
import { ReactNode } from 'react';
import styles from './layout.module.scss';
import BottomNav, {
  BottomNavItem,
} from '@/components/layout/BottomNav/BottomNav';
// import styles from './MainLayout.module.scss';

const navItems: BottomNavItem[] = [
  {
    label: '홈',
    iconName: 'home',
    href: '/main',
  },
  {
    label: '단체',
    iconName: 'dog',
    href: '/main/dogs',
  },
  {
    label: '후원',
    iconName: 'bone',
    href: '/main/donate',
  },
  {
    label: '마이페이지',
    iconName: 'petfoot',
    href: '/main/profile',
  },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <Header title='유후' type='main' />
      <main className={styles.main}>{children}</main>
      <BottomNav items={navItems} />
    </div>
  );
}
