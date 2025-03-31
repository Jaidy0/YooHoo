'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import DogCard from '@/components/common/Card/DogCard/DogCard';
import Pagination from '@/components/common/Pagination/Pagination';
import { DogStatus } from '@/types/dog';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import IconBox from '@/components/common/IconBox/IconBox';
import { useDogData } from '@/hooks/useDogData';

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
  {
    name: '입양완료',
    link: '/admin/dogs?status=adopted',
    status: DogStatus.ADOPTED,
  },
];

export default function DogsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const shelterId = 1; // 실제로는 사용자 컨텍스트에서 가져오거나 URL에서 추출해야 합니다

  // 커스텀 훅 사용
  const {
    dogs,
    totalPages,
    currentPage,
    setCurrentPage,
    setStatus,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
  } = useDogData({
    shelterId,
    initialStatus: 'all',
  });

  // 탭 변경 시 상태 필터 업데이트
  useEffect(() => {
    const selectedStatus = dogStatusTabs[activeTab].status;

    // 타입 검사 및 변환
    if (selectedStatus === 'all') {
      setStatus('all');
    } else {
      // 숫자 상태를 배열로 변환
      setStatus([selectedStatus as number]);
    }
  }, [activeTab, setStatus]);

  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTab(index);
    setCurrentPage(0); // 탭 변경 시 첫 페이지로 이동 (0-based)
  };

  const handleDogClick = (dogId: number) => {
    router.push(`/admin/dogs/${dogId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // UI는 1-based, API는 0-based
    // 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  const handleAddDog = () => {
    router.push(`/admin/dogs/register`);
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
              initialValue={searchTerm}
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

        {isLoading ? (
          <div className={styles.loading}>데이터를 불러오는 중입니다...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.dogGrid}>
              {dogs.length > 0 ? (
                dogs.map((dog) => (
                  <DogCard
                    key={dog.dogId}
                    dog={dog}
                    onClick={handleDogClick}
                    disableRouting={true} // 관리자 페이지에서는 직접 라우팅 방지
                  />
                ))
              ) : (
                <p className={styles.noDogs}>
                  {searchTerm
                    ? `'${searchTerm}' 검색 결과가 없습니다.`
                    : '해당 상태의 강아지가 없습니다.'}
                </p>
              )}
            </div>

            {dogs.length > 0 && (
              <div className={styles.paginationContainer}>
                <Pagination
                  currentPage={currentPage + 1} // UI는 1-based로 표시
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageRangeDisplayed={5}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
