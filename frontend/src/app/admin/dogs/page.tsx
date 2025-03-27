'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import DogCard from '@/components/common/Card/DogCard/DogCard';
import Pagination from '@/components/common/Pagination/Pagination';
import { DogStatus, Gender, DogSummary } from '@/types/dog';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import IconBox from '@/components/common/IconBox/IconBox';

// 탭 메뉴 아이템
const dogStatusTabs = [
  { name: '전체', link: '/admin/dogs?status=all', status: 'all' },
  {
    name: '보호중',
    link: '/admin/dogs?status=protected',
    status: DogStatus.PROTECTED,
  },
  {
    name: '임시보호',
    link: '/admin/dogs?status=temporary',
    status: DogStatus.TEMPORARY,
  },
];

// 더미 데이터 - 실제로는 API에서 가져옵니다
// DogStatus enum 값을 배열로 변환하여 랜덤 선택을 쉽게 만듭니다
const dogStatusValues = Object.values(DogStatus).filter(
  (value) => typeof value === 'number'
);

const dummyDogs: DogSummary[] = Array(20)
  .fill(null)
  .map((_, index) => ({
    dogId: index + 1,
    name: `봄이${index + 1}`, // 각 강아지에 고유한 이름 부여
    age: 2,
    gender: Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE,
    // 랜덤하게 DogStatus 값을 선택합니다
    status: dogStatusValues[
      Math.floor(Math.random() * dogStatusValues.length)
    ] as DogStatus,
    mainImage: {
      imageId: index + 1,
      dogId: index + 1,
      imageUrl: '/images/dummy.jpeg',
      isMain: true,
      uploadDate: new Date().toISOString(),
    },
  }));

export default function DogsPage() {
  const router = useRouter();
  const [allDogs] = useState<DogSummary[]>(dummyDogs); // 원본 데이터 저장
  const [filteredDogs, setFilteredDogs] = useState<DogSummary[]>(dummyDogs); // 필터링된 데이터
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(32); // 예시로 설정

  // 탭 변경 또는 검색어 변경 시 강아지 필터링
  useEffect(() => {
    const selectedStatus = dogStatusTabs[activeTab].status;

    // 먼저 status로 필터링
    let filtered = allDogs;

    if (selectedStatus !== 'all') {
      filtered = allDogs.filter((dog) => dog.status === selectedStatus);
    }

    // 검색어가 있으면 이름으로도 필터링
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((dog) =>
        dog.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDogs(filtered);

    // 실제 구현에서는 여기서 API 호출을 통해 데이터를 가져옵니다
    // 예: fetchDogs(selectedStatus, searchTerm, currentPage, pageSize)
    console.log('데이터 요청:', activeTab, searchTerm, currentPage);
  }, [activeTab, searchTerm, currentPage, allDogs]);

  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTab(index);
    setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동
  };

  const handleDogClick = (dogId: number) => {
    router.push(`/admin/dogs/${dogId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    console.log('검색어:', term);
  };

  const handleAddDog = () => {
    console.log('신규 강아지 등록!!');
  };

  return (
    <div className={styles.dogsPage}>
      <section className={styles.adminCard}>
        <div className={styles.headerActions}>
          <h1 className={styles.pageTitle}>강아지 정보 관리</h1>
          <div className={styles.actions}>
            <SearchBar
              placeholder='강아지 이름 검색'
              onSearch={handleSearch}
              className={styles.search}
            />
            <Button
              onClick={handleAddDog}
              variant='primary'
              leftIcon={<IconBox name='dog' size={20} />}
            >
              신규 등록
            </Button>
          </div>
        </div>

        <div className={styles.tabContainer}>
          <TabMenu
            menuItems={dogStatusTabs}
            defaultActiveIndex={activeTab}
            onMenuItemClick={handleTabClick}
            size='md'
          />
        </div>

        <div className={styles.dogGrid}>
          {filteredDogs.length > 0 ? (
            filteredDogs.map((dog) => (
              <DogCard key={dog.dogId} dog={dog} onClick={handleDogClick} />
            ))
          ) : (
            <p className={styles.noDogs}>
              {searchTerm
                ? `'${searchTerm}' 검색 결과가 없습니다.`
                : '해당 상태의 강아지가 없습니다.'}
            </p>
          )}
        </div>

        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageRangeDisplayed={5}
          />
        </div>
      </section>
    </div>
  );
}
