'use client';

import { useState } from 'react';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import DogCard from '@/components/common/Card/DogCard/DogCard';
import DogDetailView from '@/components/shelters/DogDetailView/DogDetailView';
import { Dog } from '@/types/dog';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useShelterData } from '@/hooks/useShetlerData';
import { useInfiniteDogData } from '@/hooks/useInfiniteDogData';

interface GroupDetailClientProps {
  groupId: string;
}

export default function GroupDetailClient({ groupId }: GroupDetailClientProps) {
  const router = useRouter();

  // useShelterData 훅 사용
  const {
    shelter,
    isLoading: isShelterLoading,
    error: shelterError,
    refreshData: refreshShelterData,
  } = useShelterData(Number(groupId));

  // useInfiniteDogData 훅 사용
  const {
    dogs,
    isLoading: isDogLoading,
    error: dogError,
    hasMore,
    loadMore,
  } = useInfiniteDogData({
    shelterId: Number(groupId),
    pageSize: 6,
    initialStatus: 'all',
    initialSearch: '',
  });

  // 탭 메뉴 아이템
  const tabMenuItems = [
    { name: '소개' },
    { name: '보호 중인 강아지' },
    { name: '후원금 운용 내역' },
  ];

  // 상태 관리
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogDetails, setDogDetails] = useState<Dog | null>(null);

  // TabMenuItem 인터페이스 정의
  interface TabMenuItem {
    name: string;
    link?: string;
    isActive?: boolean;
  }

  // 탭 클릭 핸들러
  function handleTabClick(item: TabMenuItem, index: number) {
    setActiveTab(index);
    setSelectedDog(null); // 탭 변경시 선택된 강아지 초기화
  }

  // 강아지 카드 클릭 핸들러
  function handleDogClick(dogId: number) {
    const dog = dogs.find((dog) => dog.dogId === dogId);
    if (dog) {
      setSelectedDog(dog);
      setDogDetails(dog);
    }
  }

  // 상세 정보 닫기 핸들러
  function handleCloseDetail() {
    setSelectedDog(null);
    setDogDetails(null);
  }

  // 더보기 버튼 클릭 핸들러
  function handleLoadMore() {
    loadMore();
  }

  // 단체 후원하기 버튼 클릭 핸들러
  function handleShelterDonation() {
    router.push(`/yoohoo/donate?shelterId=${groupId}`);
  }

  // 강아지 지정 후원하기 버튼 클릭 핸들러
  function handleDogDonation() {
    if (selectedDog) {
      router.push(
        `/yoohoo/donate?shelterId=${groupId}&dogId=${selectedDog.dogId}`
      );
    }
  }

  // 로딩 상태 체크
  if (isShelterLoading || isDogLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 상태 체크
  if (shelterError || dogError) {
    return (
      <div className={styles.errorContainer}>
        <p>{shelterError || dogError}</p>
        <Button
          onClick={() => {
            if (shelterError) refreshShelterData();
          }}
        >
          다시 시도하기
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.buttonWrapper}>
        <Button className={styles.yellowButton} onClick={handleShelterDonation}>
          이 단체 후원하기
        </Button>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabMenuWrapper}>
        <div className={styles.tabMenuInner}>
          <TabMenu
            menuItems={tabMenuItems}
            defaultActiveIndex={activeTab}
            onMenuItemClick={handleTabClick}
            fullWidth
          />
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 0 && (
          <div className={styles.introContent}>
            <h3 className={styles.sectionTitle}>단체 소개</h3>
            <p className={styles.fullDescription}>{shelter?.content}</p>
          </div>
        )}

        {activeTab === 1 && !selectedDog && (
          <div className={styles.dogsContent}>
            <div className={styles.dogsGrid}>
              {dogs.map((dog) => (
                <div key={dog.dogId} className={styles.dogCardWrapper}>
                  <DogCard
                    dog={dog}
                    onClick={() => handleDogClick(dog.dogId)}
                    disableRouting={true}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <Button
                  width='100%'
                  className={styles.yellowButton}
                  onClick={handleLoadMore}
                >
                  + 더보기
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && selectedDog && dogDetails && (
          <div className={styles.details}>
            <DogDetailView
              selectedDog={selectedDog}
              dogDetails={dogDetails}
              onClose={handleCloseDetail}
            />
            <Button
              width='100%'
              className={styles.yellowButton}
              onClick={handleDogDonation}
            >
              이 강아지 지정 후원하기
            </Button>
          </div>
        )}

        {activeTab === 2 && (
          <div className={styles.fundsContent}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>신뢰도</span>
              <span className={styles.statValue}>{shelter?.reliability}%</span>
            </div>
            <p>후원금 운용 내역입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
