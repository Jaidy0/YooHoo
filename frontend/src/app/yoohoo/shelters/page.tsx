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

// 임시 데이터
// const shelterData = [
//   {
//     id: 1,
//     title: '동물보호연합',
//     description: '다함께 지켜가는 후원 행복\n모두와 함으로 아이들을 지켜주세요',
//     dogCount: 99,
//     likeCount: 99,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-01-15T12:00:00Z',
//   },
//   {
//     id: 2,
//     title: '행복한 강아지',
//     description: '유기견들에게 새로운 희망을\n따뜻한 보금자리와 함께',
//     dogCount: 65,
//     likeCount: 120,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-02-20T12:00:00Z',
//   },
//   {
//     id: 3,
//     title: '희망의 발자국',
//     description:
//       '한 걸음 한 걸음 함께 걸어가요\n유기견들의 새 시작을 응원합니다',
//     dogCount: 82,
//     likeCount: 78,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-03-05T12:00:00Z',
//   },
//   {
//     id: 4,
//     title: '반려견 천국',
//     description:
//       '버려진 아이들의 천국을 만들어요\n함께하는 사랑으로 더 행복하게',
//     dogCount: 110,
//     likeCount: 150,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-01-05T12:00:00Z',
//   },
//   {
//     id: 5,
//     title: '동물보호연합',
//     description: '다함께 지켜가는 후원 행복\n모두와 함으로 아이들을 지켜주세요',
//     dogCount: 99,
//     likeCount: 99,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-01-15T12:00:00Z',
//   },
//   {
//     id: 6,
//     title: '행복한 강아지',
//     description: '유기견들에게 새로운 희망을\n따뜻한 보금자리와 함께',
//     dogCount: 65,
//     likeCount: 120,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-02-20T12:00:00Z',
//   },
//   {
//     id: 7,
//     title: '희망의 발자국',
//     description:
//       '한 걸음 한 걸음 함께 걸어가요\n유기견들의 새 시작을 응원합니다',
//     dogCount: 82,
//     likeCount: 78,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-03-05T12:00:00Z',
//   },
//   {
//     id: 8,
//     title: '반려견 천국',
//     description:
//       '버려진 아이들의 천국을 만들어요\n함께하는 사랑으로 더 행복하게',
//     dogCount: 110,
//     likeCount: 150,
//     imageUrl: '/images/shelter-image.jpg',
//     createdAt: '2025-01-05T12:00:00Z',
//   },
// ];

// 정렬 옵션
const sortOptions = [
  { value: 'popular', label: '인기도순' },
  { value: 'newest', label: '최신순' },
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
    setFilteredShelters(shelters);
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

    // 정렬 적용
    switch (sortValue) {
      case 'popular':
        filteredItems.sort((a, b) => b.reliability - a.reliability);
        break;
      case 'newest':
        filteredItems.sort(
          (a, b) =>
            new Date(b.reliability).getTime() -
            new Date(a.reliability).getTime()
        );
        break;
      case 'oldest':
        filteredItems.sort(
          (a, b) =>
            new Date(a.reliability).getTime() -
            new Date(b.reliability).getTime()
        );
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
