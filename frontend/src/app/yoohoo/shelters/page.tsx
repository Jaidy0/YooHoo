'use client';

import { useState } from 'react';
import styles from './page.module.scss';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropDown from '@/components/common/DropDown/DropDown';
import ShelterCard from '@/components/shelters/ShelterCard/ShelterCard';

// 임시 데이터
const shelterItems = [
  {
    id: 1,
    title: '동물보호연합',
    description: '다함께 지켜가는 후원 행복\n모두와 함으로 아이들을 지켜주세요',
    dogCount: 99,
    likeCount: 99,
    imageUrl: '/images/shelter-image.jpg',
  },
  {
    id: 2,
    title: '검색?',
    description: '다함께 지켜가는 후원 행복\n모두와 함으로 아이들을 지켜주세요',
    dogCount: 99,
    likeCount: 99,
    imageUrl: '/images/shelter-image.jpg',
  },
  {
    id: 3,
    title: '동물보호연합',
    description: '다함께 지켜가는 후원 행복\n모두와 함으로 아이들을 지켜주세요',
    dogCount: 99,
    likeCount: 99,
    imageUrl: '/images/shelter-image.jpg',
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 검색 로직 구현
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    // 정렬 로직 구현
  };

  return (
    <div className={styles.shelterPage}>
      <div className={styles.container}>
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
    </div>
  );
}
