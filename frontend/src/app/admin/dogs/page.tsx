'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import DogCard from '@/components/common/Card/DogCard/DogCard';
import Pagination from '@/components/common/Pagination/Pagination';
import { DogStatus, getStatusText } from '@/types/dog';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import IconBox from '@/components/common/IconBox/IconBox';
import { useDogData } from '@/hooks/useDogData';

// 탭 메뉴 아이템 (DogStatus enum에 맞춤)
const dogStatusTabs = [
  { name: '전체', link: '/admin/dogs?status=all', status: 'all' },
  {
    name: '보호중',
    link: '/admin/dogs?status=protected',
    status: DogStatus.PROTECTED, // 0
  },
  {
    name: '임시보호',
    link: '/admin/dogs?status=temporary',
    status: DogStatus.TEMPORARY, // 1
  },
  {
    name: '입양완료',
    link: '/admin/dogs?status=adopted',
    status: DogStatus.ADOPTED, // 2
  },
  {
    name: '사망',
    link: '/admin/dogs?status=deceased',
    status: DogStatus.DECEASED, // 3
  },
];

export default function DogsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const shelterId = 1; // 실제로는 사용자 컨텍스트에서 가져오거나 URL에서 추출

  // 커스텀 훅 사용 - 20개씩 표시
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
    refetch,
  } = useDogData({
    shelterId,
    initialStatus: 'all',
    pageSize: 20, // 한 페이지에 20마리 표시
  });

  // 탭 변경 시 상태 필터 업데이트
  useEffect(() => {
    const selectedStatus = dogStatusTabs[activeTab].status;
    console.log('탭 변경됨. 선택된 상태:', selectedStatus);

    // 타입 검사 및 변환
    if (selectedStatus === 'all') {
      console.log('전체 상태로 설정');
      setStatus('all');
    } else {
      // 숫자 상태를 배열로 변환
      console.log('특정 상태로 설정:', [selectedStatus as number]);
      setStatus([selectedStatus as number]);
    }
  }, [activeTab, setStatus]);

  const handleTabClick = (item: TabMenuItem, index: number) => {
    console.log('탭 클릭:', item.name, '인덱스:', index);
    setActiveTab(index);
    setCurrentPage(0); // 탭 변경 시 첫 페이지로 이동 (0-based)
  };

  const handleDogClick = (dogId: number) => {
    router.push(`/admin/dogs/${dogId}`);
  };

  // DogsPage.tsx 파일 내 페이지 변경 핸들러 수정

  const handlePageChange = (page: number) => {
    console.log('페이지 변경:', page);

    // UI는 1-based, API는 0-based이므로 변환
    const apiPage = page - 1;
    console.log('API용 페이지(0-based):', apiPage);

    // 페이지 변경하고 데이터 새로 로드
    setCurrentPage(apiPage);

    // 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 디버깅용 출력 추가
  useEffect(() => {
    console.log('현재 페이지(0-based):', currentPage);
    console.log('현재 표시 중인 dogs 길이:', dogs.length);

    if (dogs.length > 0) {
      console.log('첫 번째 강아지:', dogs[0].name, '(ID:', dogs[0].dogId, ')');
      console.log(
        '마지막 강아지:',
        dogs[dogs.length - 1].name,
        '(ID:',
        dogs[dogs.length - 1].dogId,
        ')'
      );
    }
  }, [currentPage, dogs]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  const handleAddDog = () => {
    router.push(`/admin/dogs/register`);
  };

  // 디버깅용 출력
  useEffect(() => {
    console.log('현재 dogs 배열:', dogs);
    console.log('현재 표시 중인 dogs 길이:', dogs.length);
  }, [dogs]);

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
            {/* 디버깅 정보 - 실제 배포 시 제거 */}
            <div
              style={{
                margin: '10px 0',
                padding: '5px',
                background: '#f5f5f5',
                fontSize: '12px',
              }}
            >
              <p>
                상태: {dogStatusTabs[activeTab].name} | 페이지:{' '}
                {currentPage + 1}/{totalPages || 1} | 데이터 수:{' '}
                {dogs?.length || 0}
              </p>
            </div>

            <div className={styles.dogGrid}>
              {dogs && dogs.length > 0 ? (
                dogs.map((dog) => (
                  <DogCard
                    key={dog.dogId}
                    dog={dog}
                    onClick={() => handleDogClick(dog.dogId)}
                    disableRouting={true} // 관리자 페이지에서는 직접 라우팅 방지
                    statusLabel={getStatusText(dog.status)}
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

            {dogs && dogs.length > 0 && (
              <div className={styles.paginationContainer}>
                <Pagination
                  currentPage={currentPage + 1} // UI는 1-based로 표시
                  totalPages={totalPages || 1}
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
