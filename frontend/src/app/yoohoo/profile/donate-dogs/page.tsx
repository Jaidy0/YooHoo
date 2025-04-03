'use client';

import DogCard from '@/components/common/Card/DogCard/DogCard';
import styles from './page.module.scss';
import { useDonatedDogs } from '@/hooks/donations/useDonatedDogs';

export default function MyDonateDogPage() {
  const { dogs, isLoading, error } = useDonatedDogs();

  // 로딩 중 상태 표시
  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>내가 후원한 강아지</h1>
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>
            강아지 목록을 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>내가 후원한 강아지</h1>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!dogs || dogs.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>내가 후원한 강아지</h1>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyTitle}>후원한 강아지가 없습니다</p>
          <p className={styles.emptySubtitle}>
            강아지 후원을 통해 작은 변화를 만들어보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내가 후원한 강아지</h1>

      <div className={styles.dogGrid}>
        {dogs.map((dog) => (
          <DogCard key={dog.dogId} dog={dog} disableRouting={true} />
        ))}
      </div>
    </div>
  );
}
