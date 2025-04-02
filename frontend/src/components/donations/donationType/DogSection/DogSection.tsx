'use client';

import { useState, useEffect, useRef } from 'react';
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
  const selectedDogRef = useRef<HTMLDivElement>(null);

  // 강아지 목록 가져오기
  const { dogs, isLoading, error } = useDogList(shelterId, searchTerm);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // 선택된 강아지로 스크롤
  useEffect(() => {
    // 검색어가 비어있고, 선택된 강아지가 있으며, 로딩 중이 아닐 때만 스크롤
    if (!searchTerm && selectedDogId && !isLoading && selectedDogRef.current) {
      selectedDogRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [searchTerm, selectedDogId, isLoading]);

  return (
    <div className={styles.dogSection}>
      <h3 className={styles.subTitle}>후원할 강아지를 지정해주세요</h3>
      <div className={styles.searchContainer}>
        <SearchBar
          placeholder='강아지명을 입력해 주세요'
          onSearch={handleSearch}
          fullWidth
          initialValue={searchTerm}
        />
      </div>

      {isLoading ? (
        <div className={styles.loading}>강아지 목록을 불러오는 중입니다...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.dogList}>
          {dogs.length > 0 ? (
            dogs.map((dog) => {
              const isSelected = selectedDogId === dog.dogId;
              return (
                <div key={dog.dogId} ref={isSelected ? selectedDogRef : null}>
                  <DogCard
                    id={dog.dogId}
                    name={dog.name}
                    imageUrl={dog.imageUrl || ''}
                    isSelected={isSelected}
                    onClick={onSelectDog}
                  />
                </div>
              );
            })
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
