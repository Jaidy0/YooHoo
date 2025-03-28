'use client';

import { useState } from 'react';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import DogCard from '@/components/common/Card/DogCard/DogCard';
import { DogSummary, Gender, DogStatus } from '@/types/dog';
import styles from './page.module.scss';

interface GroupDetailClientProps {
  groupId: string;
}

export default function GroupDetailClient({ groupId }: GroupDetailClientProps) {
  // 더미 데이터
  const groupDesc = `계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 나는 아무 걱정도 없이 가을 속의 별들을 다 헤일 듯합니다. 가을 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬이 아닙니다.`;

  // 더미 강아지 데이터
  const dogsList: DogSummary[] = [
    {
      dogId: 1,
      name: '봄이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.PROTECTED,
      mainImage: {
        imageId: 1,
        dogId: 1,
        imageUrl: '/images/dummy.jpeg',
        isMain: true,
        uploadDate: '2024-03-15',
      },
    },
    {
      dogId: 2,
      name: '봄이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.ADOPTED,
      mainImage: {
        imageId: 2,
        dogId: 2,
        imageUrl: '/images/dummy.jpeg',
        isMain: true,
        uploadDate: '2024-03-15',
      },
    },
    {
      dogId: 3,
      name: '봄이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.TEMPORARY,
      mainImage: {
        imageId: 3,
        dogId: 3,
        imageUrl: '/images/dummy.jpeg',
        isMain: true,
        uploadDate: '2024-03-15',
      },
    },
    {
      dogId: 4,
      name: '봄이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.PROTECTED,
      mainImage: {
        imageId: 4,
        dogId: 4,
        imageUrl: '/images/dummy.jpeg',
        isMain: true,
        uploadDate: '2024-03-15',
      },
    },
    {
      dogId: 5,
      name: '봄이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.PROTECTED,
      mainImage: {
        imageId: 5,
        dogId: 5,
        imageUrl: '/images/dummy.jpeg',
        isMain: true,
        uploadDate: '2024-03-15',
      },
    },
    {
      dogId: 6,
      name: '봄이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.PROTECTED,
      mainImage: {
        imageId: 6,
        dogId: 6,
        imageUrl: '/images/dummy.jpeg',
        isMain: true,
        uploadDate: '2024-03-15',
      },
    },
  ];

  // 탭 메뉴 아이템
  const tabMenuItems = [
    { name: '소개', link: `/groups/${groupId}?tab=intro` },
    { name: '보호 중인 강아지', link: `/groups/${groupId}?tab=dogs` },
    { name: '후원금 운용 내역', link: `/groups/${groupId}?tab=funds` },
  ];

  // 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState(1); // 기본값을 두 번째 탭(보호 중인 강아지)으로 설정

  // TabMenuItem 인터페이스 정의 (이미 존재하는 인터페이스와 동일하게 맞춤)
  interface TabMenuItem {
    name: string;
    link: string;
    isActive?: boolean;
  }

  // 탭 클릭 핸들러
  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTab(index);
  };

  // 강아지 카드 클릭 핸들러
  const handleDogClick = (dogId: number) => {
    console.log(`강아지 ${dogId} 클릭됨`);
    // 필요한 경우 여기에 다른 처리 추가
  };

  return (
    <div className={styles.contentContainer}>
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
            <p className={styles.fullDescription}>{groupDesc}</p>
          </div>
        )}
        {activeTab === 1 && (
          <div className={styles.dogsContent}>
            <div className={styles.dogsGrid}>
              {dogsList.map((dog) => (
                <div key={dog.dogId} className={styles.dogCardWrapper}>
                  <DogCard dog={dog} onClick={handleDogClick} />
                </div>
              ))}
            </div>
            <button className={styles.moreButton}>+ 더보기</button>
          </div>
        )}
        {activeTab === 2 && (
          <div className={styles.fundsContent}>
            {/* 후원금 운용 내역은 다음 단계에서 구현 */}
            <p>후원금 운용 내역입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
