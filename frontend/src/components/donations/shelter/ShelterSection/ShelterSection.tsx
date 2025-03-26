'use client';

import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import StepTitle from '../../StepTitle/StepTitle';
import ShelterCard from '../ShelterCard/ShelterCard';
import styles from './ShelterSection.module.scss';

type ShelterSectionProps = {
  selectedShelterId: number;
  onSelectShelter: (id: number, name: string) => void;
};

export default function ShelterSection({
  selectedShelterId,
  onSelectShelter,
}: ShelterSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  //   const { data: allShelters = [], isLoading: isLoadingShelters } = useShelters(searchTerm);
  //   const { data: recentDonations = [], isLoading: isLoadingRecent } = useRecentDonations();

  // 더미 데이터: 단체 목록
  const dummyShelters = [
    { shelterId: 1, name: '단체명', isRecent: true, imageUrl: '' },
    { shelterId: 2, name: '단체명', isRecent: false, imageUrl: '' },
    { shelterId: 3, name: '단체명', isRecent: false, imageUrl: '' },
    { shelterId: 4, name: '단체명', isRecent: true, imageUrl: '' },
  ];

  // 검색 처리
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // 검색 결과 필터링
  const filteredShelters = searchTerm
    ? dummyShelters.filter((shelter) =>
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dummyShelters;

  // 정렬: 최근 후원 단체가 상단에 오도록
  const sortedShelters = [...filteredShelters].sort((a, b) => {
    if (a.isRecent && !b.isRecent) return -1;
    if (!a.isRecent && b.isRecent) return 1;
    return 0;
  });

  return (
    <div>
      <StepTitle number={1} title='후원할 단체 선택' />

      <SearchBar
        onSearch={handleSearch}
        placeholder='단체명을 입력해주세요'
        fullWidth
      />

      {sortedShelters.length > 0 ? (
        <div className={styles.shelterList}>
          {sortedShelters.map((shelter) => (
            <ShelterCard
              key={shelter.shelterId}
              id={shelter.shelterId}
              name={shelter.name}
              imageUrl={shelter.imageUrl}
              isSelected={selectedShelterId === shelter.shelterId}
              isRecent={shelter.isRecent}
              onClick={onSelectShelter}
            />
          ))}
        </div>
      ) : (
        <div>검색 결과가 없습니다.</div>
      )}
    </div>
  );
}
