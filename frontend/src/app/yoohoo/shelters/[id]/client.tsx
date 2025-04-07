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
import { useDog } from '@/hooks/useDog';
import DonationUsageChart from '@/components/shelters/DonationUsageChart/DonationUsageChart';
import ReliabilityChart from '@/components/shelters/ReliabilityChart/ReliabilityChart';
import DonationUseHistoryList from '@/components/shelters/DonationUseHistoryList/DonationUseHistoryList';

interface GroupDetailClientProps {
  groupId: string;
}

// Mock 데이터 추가
const mockDonationData = {
  categories: [
    {
      name: '인건비',
      color: '#f57c17',
      actualPercentage: 30,
      averagePercentage: 30,
    },
    {
      name: '시설 유지비',
      color: '#f2b2d1',
      actualPercentage: 30,
      averagePercentage: 30,
    },
    {
      name: '사료비',
      color: '#ee417c',
      actualPercentage: 30,
      averagePercentage: 50,
    },
    {
      name: '물품 구매',
      color: '#f4b616',
      actualPercentage: 30,
      averagePercentage: 30,
    },
    {
      name: '의료비',
      color: '#1bb9b3',
      actualPercentage: 30,
      averagePercentage: 30,
    },
    {
      name: '기타',
      color: '#7a91e0',
      actualPercentage: 30,
      averagePercentage: 30,
    },
  ],
  totalIncome: 34000400,
  totalExpense: 28930400,
  year: 2025,
  month: 2,
  histories: [
    {
      id: 1,
      date: '2025.03.04',
      amount: -320000,
      description: '강아지 사료 구매',
      isVerified: true,
    },
    {
      id: 2,
      date: '2025.03.04',
      amount: -320000,
      description: '강아지 사료 구매',
      isVerified: false,
    },
    {
      id: 3,
      date: '2025.03.04',
      amount: -320000,
      description: '강아지 사료 구매',
      isVerified: true,
    },
    {
      id: 4,
      date: '2025.03.04',
      amount: -320000,
      description: '강아지 사료 구매',
      isVerified: true,
    },
  ],
};

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

  // 상태 관리
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<number | null>(null);

  // 선택된 강아지의 상세 정보를 가져오기 위한 useDog 훅
  const { dog: dogDetails, isLoading: isDogDetailsLoading } = useDog(
    selectedDogId || 0
  );

  // 탭 메뉴 아이템
  const tabMenuItems = [
    { name: '소개' },
    { name: '보호 중인 강아지' },
    { name: '후원금 운용 내역' },
  ];

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
      setSelectedDogId(dogId);
    }
  }

  // 상세 정보 닫기 핸들러
  function handleCloseDetail() {
    setSelectedDog(null);
    setSelectedDogId(null);
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
                  className={styles.moreBtn}
                  onClick={handleLoadMore}
                >
                  + 더보기
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && selectedDog && (
          <div className={styles.details}>
            {isDogDetailsLoading ? (
              <div className={styles.loadingContainer}>
                <LoadingSpinner />
              </div>
            ) : dogDetails ? (
              <>
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
              </>
            ) : (
              <div className={styles.errorContainer}>
                <p>강아지 정보를 불러오는데 실패했습니다.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className={styles.fundsContent}>
            <h2 className={styles.sectionTitle}>후원금 운용 내역</h2>
            <ReliabilityChart
              reliability={shelter?.reliability || 0}
              reliabilityPercentage={shelter?.reliabilityPercentage || 0}
            />
            <DonationUsageChart
              categories={mockDonationData.categories}
              totalIncome={mockDonationData.totalIncome}
              totalExpense={mockDonationData.totalExpense}
              year={mockDonationData.year}
              month={mockDonationData.month}
            />
            <DonationUseHistoryList histories={mockDonationData.histories} />
          </div>
        )}
      </div>
    </div>
  );
}
