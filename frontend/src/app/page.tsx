// import Image from 'next/image';
import styles from './page.module.scss';
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
          <div className={styles.admin}>관리자용</div>
        ) : (
          <div className={styles.user}>사용자용페이지입니다.Pretendard</div>
        )}
      </main>
    </div>
  );
}
