'use client';

import { useState } from 'react';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import DogCard from '@/components/common/Card/DogCard/DogCard';
import DogDetailView from '@/components/shelters/DogDetailView/DogDetailView';
import { Dog, Gender, DogStatus } from '@/types/dog';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';
import { useRouter } from 'next/navigation';

interface GroupDetailClientProps {
  groupId: string;
}

export default function GroupDetailClient({ groupId }: GroupDetailClientProps) {
  console.log(groupId);
  // 더미 데이터
  const groupDesc = `계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 나는 아무 걱정도 없이 가을 속의 별들을 다 헤일 듯합니다. 가을 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬이 아닙니다.`;

  // 더미 강아지 데이터
  const dogsList: Dog[] = [
    {
      dogId: 1,
      name: '봄이',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.PROTECTED,
      shelterId: 1,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
    {
      dogId: 2,
      name: '호두',
      age: 3,
      gender: Gender.MALE,
      status: DogStatus.ADOPTED,
      shelterId: 1,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
    {
      dogId: 3,
      name: '쿠키',
      age: 1,
      gender: Gender.FEMALE,
      status: DogStatus.TEMPORARY,
      shelterId: 1,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
    {
      dogId: 4,
      name: '콩이',
      age: 4,
      gender: Gender.MALE,
      status: DogStatus.PROTECTED,
      shelterId: 1,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
    {
      dogId: 5,
      name: '초코',
      age: 2,
      gender: Gender.FEMALE,
      status: DogStatus.PROTECTED,
      shelterId: 1,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
    {
      dogId: 6,
      name: '달이',
      age: 5,
      gender: Gender.MALE,
      status: DogStatus.PROTECTED,
      shelterId: 1,
      imageUrl: '/images/dummy.jpeg',
      weight: 0,
      breed: '',
      energetic: 0,
      familiarity: 0,
      isVaccination: false,
      isNeutered: false,
      admissionDate: '',
    },
  ];

  // 탭 메뉴 아이템
  const tabMenuItems = [
    { name: '소개' },
    { name: '보호 중인 강아지' },
    { name: '후원금 운용 내역' },
  ];

  const router = useRouter();

  // 상태 관리
  const [activeTab, setActiveTab] = useState(1); // 기본값을 두 번째 탭(보호 중인 강아지)으로 설정
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogDetails, setDogDetails] = useState<Dog | null>(null);

  // TabMenuItem 인터페이스 정의
  interface TabMenuItem {
    name: string;
    link?: string;
    isActive?: boolean;
  }

  // 탭 클릭 핸들러
  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTab(index);
    setSelectedDog(null); // 탭 변경시 선택된 강아지 초기화
  };

  // 강아지 카드 클릭 핸들러
  const handleDogClick = (dogId: number) => {
    const dog = dogsList.find((dog) => dog.dogId === dogId);
    if (dog) {
      setSelectedDog(dog);
      // 실제 환경에서는 API 호출로 상세 정보를 가져옵니다.
      // 예: fetchDogDetails(dogId).then(data => setDogDetails(data));

      // 임시 상세 데이터
      const details: Dog = {
        dogId: dog.dogId,
        shelterId: dog.shelterId,
        name: dog.name,
        age: dog.age,
        weight: dog.dogId * 1.5, // 임의의 몸무게 (실제로는 API에서 가져옴)
        gender: dog.gender,
        breed: [
          '말티즈',
          '비숑',
          '포메라니안',
          '골든 리트리버',
          '웰시코기',
          '허스키',
        ][dog.dogId % 6],
        energetic: (dog.dogId % 5) + 1, // 1-5 활발함 정도
        familiarity: (dog.dogId % 5) + 1, // 1-5 친화력 정도
        isVaccination: true,
        isNeutered: dog.dogId % 2 === 0,
        status: dog.status,
        admissionDate: `2024-0${(dog.dogId % 9) + 1}-${(dog.dogId % 28) + 1}T15:00:00.000+00:00`,
        imageUrl: '/images/dummy.jpeg',
      };

      setDogDetails(details);
    }
  };

  // 상세 정보 닫기 핸들러
  const handleCloseDetail = () => {
    setSelectedDog(null);
    setDogDetails(null);
  };

  return (
    <div className={styles.contentContainer}>
      <div className={styles.buttonWrapper}>
        <Button
          width='90%'
          className={styles.yellowButton}
          onClick={() => router.push('/yoohoo/donate')}
        >
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
            <p className={styles.fullDescription}>{groupDesc}</p>
          </div>
        )}
        {activeTab === 1 && !selectedDog && (
          <div className={styles.dogsContent}>
            <div className={styles.dogsGrid}>
              {dogsList.map((dog) => (
                <div key={dog.dogId} className={styles.dogCardWrapper}>
                  <DogCard
                    dog={dog}
                    onClick={() => handleDogClick(dog.dogId)}
                    disableRouting={true} // 자동 라우팅 비활성화
                  />
                </div>
              ))}
            </div>
            <Button width='100%' className={styles.yellowButton}>
              + 더보기
            </Button>
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
              onClick={() => router.push('/yoohoo/donate')}
            >
              이 강아지 지정 후원하기
            </Button>
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
