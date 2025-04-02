'use client';

import { useState } from 'react';
import styles from './DogSection.module.scss';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DogCard from '../DogCard/DogCard';
import { useDogList } from '@/hooks/donations/useDogList';

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

  // 강아지 목록 가져오기
  const { dogs, isLoading, error } = useDogList(shelterId, searchTerm);

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

      {isLoading ? (
        <div className={styles.loading}>강아지 목록을 불러오는 중입니다...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.dogList}>
          {dogs.length > 0 ? (
            dogs.map((dog) => (
              <DogCard
                key={dog.dogId}
                id={dog.dogId}
                name={dog.name}
                imageUrl={dog.imageUrl || ''}
                isSelected={selectedDogId === dog.dogId}
                onClick={onSelectDog}
              />
            ))
          ) : (
            <div className={styles.noResults}>
              {searchTerm
                ? '검색 결과가 없습니다'
                : '보호 중인 강아지가 없습니다'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
