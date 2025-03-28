'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropDown from '@/components/common/DropDown/DropDown';
import ShelterCard from '@/components/shelters/ShelterCard/ShelterCard';

// 임시 데이터
const shelterData = [
  {
    id: 1,
    title: '동물보호연합',
    description: '다함께 지켜가는 후원 행복\n모두와 함으로 아이들을 지켜주세요',
    dogCount: 99,
    likeCount: 99,
    imageUrl: '/images/shelter-image.jpg',
    createdAt: '2025-01-15T12:00:00Z',
  },
  {
    id: 2,
    title: '행복한 강아지',
    description: '유기견들에게 새로운 희망을\n따뜻한 보금자리와 함께',
    dogCount: 65,
    likeCount: 120,
    imageUrl: '/images/shelter-image.jpg',
    createdAt: '2025-02-20T12:00:00Z',
  },
  {
    id: 3,
    title: '희망의 발자국',
    description:
      '한 걸음 한 걸음 함께 걸어가요\n유기견들의 새 시작을 응원합니다',
    dogCount: 82,
    likeCount: 78,
    imageUrl: '/images/shelter-image.jpg',
    createdAt: '2025-03-05T12:00:00Z',
  },
  {
    id: 4,
    title: '반려견 천국',
    description:
      '버려진 아이들의 천국을 만들어요\n함께하는 사랑으로 더 행복하게',
    dogCount: 110,
    likeCount: 150,
    imageUrl: '/images/shelter-image.jpg',
    createdAt: '2025-01-05T12:00:00Z',
  },
];

// 정렬 옵션
const sortOptions = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
];

export default function Shelters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const [shelterItems, setShelterItems] = useState(shelterData);

  // 검색과 정렬을 모두 적용하는 함수
  const applyFilters = (query: string, sortValue: string) => {
    let filteredItems = [...shelterItems];

    // 검색어가 있으면 필터링
    if (query.trim() !== '') {
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // 정렬 적용
    switch (sortValue) {
      case 'popular':
        // 좋아요 수 기준 내림차순 정렬
        filteredItems.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'newest':
        // 등록일 기준 최신순 정렬
        filteredItems.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        // 등록일 기준 오래된순 정렬
        filteredItems.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    setShelterItems(filteredItems);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedSort);

    // 검색 로직 구현
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    applyFilters(searchQuery, value);

    // 정렬 로직 구현
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
        <div className={styles.dropdownContainer}>
          <DropDown
            options={sortOptions}
            value={selectedSort}
            onChange={handleSortChange}
            className={styles.dropdown}
          />
        </div>

        <div className={styles.shelters}>
          {shelterItems.map((shelter) => (
            <ShelterCard
              key={shelter.id}
              imageUrl={shelter.imageUrl}
              title={shelter.title}
              description={shelter.description}
              dogCount={shelter.dogCount}
              likeCount={shelter.likeCount}
              onClick={() => {
                // 보호소 상세 페이지로 이동하는 로직
                console.log(`보호소 ${shelter.id} 클릭됨`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
