// import Image from 'next/image';
import IconBox from '@/components/common/IconBox/IconBox';
import styles from './page.module.scss';
import BottomNav, {
  BottomNavItem,
} from '@/components/common/BottomNav/BottomNav';
// import logo from '@/assets/imgs/yoohoo-logo.svg';

export default function Home() {
  // const { user, setUser } = useAuthStore();

  // React Query로 사용자 프로필 및 역할 가져오기
  // const { data: userProfile } = useQuery({
  //   queryKey: ['userProfile', user?.id],
  //   queryFn: () => fetchUserProfile(user?.id),
  //   enabled: !!user?.id,
  //   onSuccess: (data) => {
  //     setUser({ ...user, role: data.role });
  //   },
  // });

  // const isAdmin = user?.role === 'admin';
  const isAdmin = 'user';

  // BottomNav에 사용할 목 데이터
  const navItems: BottomNavItem[] = [
    {
      label: '홈',
      iconName: 'home',
      href: '/',
    },
    {
      label: '단체',
      iconName: 'dog',
      href: '/dogs',
    },
    {
      label: '후원',
      iconName: 'bone',
      href: '/donate',
    },
    {
      label: '마이페이지',
      iconName: 'petfoot',
      href: '/profile',
    },
  ];

  return (
    <div
      className={`
        ${styles.container} 
        ${isAdmin ? styles.adminMode : styles.userMode}
      `}
    >
      <main style={{ fontSize: '30px' }}>
        {/* 역할별 다른 컴포넌트 렌더링 */}
        {isAdmin != 'user' ? (
          <div className={styles.admin}>관리자용 페이지입니다</div>
        ) : (
          <div className={styles.user}>
            <div className={styles.content}>사용자용페이지입니다.</div>
            <BottomNav items={navItems} />
          </div>
        )}
      </main>
    </div>
  );
}
