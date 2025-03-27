'use client';

import { useState } from 'react';
import styles from './DogSection.module.scss';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DogCard from '../DogCard/DogCard';

// 예시 강아지 데이터 인터페이스
interface Dog {
  id: number;
  name: string;
  imageUrl?: string;
}

type DogSectionProps = {
  shelterId: number;
  selectedDogId: number;
  onSelectDog: (id: number, name: string) => void;
  stepNumber: number;
};

export default function DogSection({
  shelterId,
  selectedDogId,
  onSelectDog,
  stepNumber,
}: DogSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 더미 데이터
  const dummyDogs: Dog[] = [
    { id: 1, name: '반디', imageUrl: '' },
    { id: 2, name: '보미', imageUrl: '' },
    { id: 3, name: '파이', imageUrl: '' },
    { id: 4, name: '파이', imageUrl: '' },
    { id: 5, name: '파이', imageUrl: '' },
    { id: 6, name: '파이', imageUrl: '' },
    { id: 7, name: '파이', imageUrl: '' },
  ];

  // 검색어 기반 필터링
  const filteredDogs = searchTerm
    ? dummyDogs.filter((dog) =>
        dog.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dummyDogs;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className={styles.dogSection}>
      <h3 className={styles.subTitle}>후원할 강아지를 지정해주세요</h3>
      <div className={styles.searchContainer}>
        <SearchBar
          placeholder='강아지명을 입력해 주세요'
          onSearch={handleSearch}
          fullWidth
        />
      </div>

      <div className={styles.dogList}>
        {filteredDogs.length > 0 ? (
          filteredDogs.map((dog) => (
            <DogCard
              key={dog.id}
              id={dog.id}
              name={dog.name}
              imageUrl={dog.imageUrl}
              isSelected={selectedDogId === dog.id}
              onClick={onSelectDog}
            />
          ))
        ) : (
          <div className={styles.noResults}>검색 결과가 없습니다</div>
        )}
      </div>
    </div>
  );
}
