'use client';

import DogCard from '@/components/common/Card/DogCard/DogCard';
import styles from './page.module.scss';
import { useDonatedDogs } from '@/hooks/donations/useDonatedDogs';
import { useRouter } from 'next/navigation';

export default function MyDonateDogPage() {
  const router = useRouter();
  const { dogs, isLoading, error } = useDonatedDogs();

  // 강아지 카드 클릭 핸들러
  const handleDogClick = (dogId: number, shelterId?: number) => {
    if (shelterId) {
      // 단체 페이지의 강아지 상세화면으로 이동
      // URL은 /yoohoo/shelters/{shelterId}로, 2번째 탭(강아지 탭)을 선택하고 해당 강아지를 선택한 상태로 이동
      router.push(`/yoohoo/shelters/${shelterId}?tab=1&dogId=${dogId}`);
    }
  };

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
        <div className={styles.emptyContainer}>
          <p className={styles.emptyTitle}>후원한 강아지가 없습니다</p>
          <p className={styles.emptySubtitle}>
            강아지 후원을 통해 작은 변화를 만들어보세요!
          </p>
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
          <DogCard
            key={dog.dogId}
            dog={dog}
            disableRouting={true}
            onClick={() => handleDogClick(dog.dogId, dog.shelterId)}
          />
        ))}
      </div>
    </div>
  );
}
