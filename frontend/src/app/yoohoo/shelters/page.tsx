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

  // shelters가 변경될 때마다 filteredShelters 초기화
  useEffect(() => {
    // 신뢰도 순으로 정렬
    const sortedShelters = [...shelters].sort(
      (a, b) => b.reliability - a.reliability
    );
    setFilteredShelters(sortedShelters);
  }, [shelters]);

  // 검색어나 정렬이 변경될 때마다 필터링 적용
  const applyFilters = (query: string, sortValue: string) => {
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

    setFilteredShelters(filteredItems);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedSort);
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    applyFilters(searchQuery, value);
  };

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
            <span>단체 리스트</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
