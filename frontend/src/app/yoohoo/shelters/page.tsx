'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropDown from '@/components/common/DropDown/DropDown';
import ShelterCard from '@/components/shelters/ShelterCard/ShelterCard';
import { useShelterList } from '@/hooks/useShelterList';
import { Shelter } from '@/types/shelter';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import IconTooltip from '@/components/common/IconTooltip/IconTooltip';
import Button from '@/components/common/buttons/Button/Button';

// 정렬 옵션
const sortOptions = [
  { value: 'reliability', label: '신뢰도순' },
  { value: 'dogCount', label: '강아지 수' },
  { value: 'oldest', label: '오래된순' },
];

export default function Shelters() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const { shelters, isLoading } = useShelterList();
  const [filteredShelters, setFilteredShelters] = useState<Shelter[]>([]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // shelters가 변경될 때마다 filteredShelters 초기화
  useEffect(() => {
    let sortedShelters = [...shelters];

    switch (selectedSort) {
      case 'reliability':
        sortedShelters.sort((a, b) => b.reliability - a.reliability);
        break;
      case 'dogCount':
        sortedShelters.sort((a, b) => b.dogCount - a.dogCount);
        break;
      case 'oldest':
        sortedShelters.sort((a, b) => {
          const dateA = new Date(a.foundation_date).getTime();
          const dateB = new Date(b.foundation_date).getTime();
          return dateA - dateB;
        });
        break;
      default:
        break;
    }

    setFilteredShelters(sortedShelters.slice(0, itemsPerPage * currentPage));
  }, [shelters, currentPage, selectedSort]);

  // 검색어나 정렬이 변경될 때마다 필터링 적용
  const applyFilters = (
    query: string,
    sortValue: string,
    page: number = currentPage
  ) => {
    let filteredItems = [...shelters];

    // 검색어가 있으면 필터링
    if (query.trim() !== '') {
      filteredItems = filteredItems.filter(
        (item: Shelter) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase())
      );
    }

    console.log('[shelters] 필터링된 결과:', filteredItems);

    // 정렬 적용
    switch (sortValue) {
      case 'reliability':
        filteredItems.sort((a, b) => b.reliability - a.reliability);
        console.log('[shelters] 신뢰도순 정렬 완료:', filteredItems);
        break;
      case 'dogCount':
        filteredItems.sort((a, b) => b.dogCount - a.dogCount);
        console.log('[shelters] 강아지 수 정렬 완료:', filteredItems);
        break;
      case 'oldest':
        filteredItems.sort((a, b) => {
          const dateA = new Date(a.foundation_date).getTime();
          const dateB = new Date(b.foundation_date).getTime();
          return dateA - dateB; // 오름차순 (오래된 날짜부터)
        });
        console.log('[shelters] 오래된순 정렬 완료:', filteredItems);
        break;
      default:
        break;
    }

    setFilteredShelters(filteredItems.slice(0, itemsPerPage * page));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedSort);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    setCurrentPage(1);
    applyFilters(searchQuery, value, 1);
  };

  const toggleTooltip = () => {
    setIsTooltipOpen((prev) => !prev);
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    const target = document.querySelector('#scrollEnd');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  return (
    <div className={styles.shelterPage}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.subTitle}>YOOHOO와 함께하는</div>
          <div className={styles.mainTitle}>유기견 후원 단체</div>
        </div>
        <SearchBar
          className={styles.searchBar}
          placeholder='찾으시는 단체 이름을 입력해주세요.'
          initialValue={searchQuery}
          onSearch={handleSearch}
        />
      </div>

      <div className={styles.shelterList}>
        <div className={styles.shelters}>
          <div className={styles.dropdownContainer}>
            <span className={styles.dropdownTitle}>
              단체 리스트{' '}
              <IconTooltip isOpen={isTooltipOpen} onToggle={toggleTooltip} />
            </span>
            <DropDown
              options={sortOptions}
              value={selectedSort}
              onChange={handleSortChange}
              className={styles.dropdown}
            />
          </div>
          <div className={styles.shelterCards}>
            {isLoading ? (
              <LoadingSpinner size='large' />
            ) : (
              filteredShelters.map((shelter: Shelter) => (
                <ShelterCard
                  className={styles.shelterCard}
                  key={shelter.shelterId}
                  imageUrl={shelter.imageUrl}
                  title={shelter.name}
                  description={shelter.content}
                  dogCount={shelter.dogCount}
                  reliability={shelter.reliability}
                  onClick={() => {
                    router.push(`/yoohoo/shelters/${shelter.shelterId}`);
                  }}
                />
              ))
            )}
            <Button
              variant='primary'
              onClick={loadMore}
              className={styles.loadMoreButton}
              width='100%'
            >
              더보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
