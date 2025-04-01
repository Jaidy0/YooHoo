'use client';

import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import StepTitle from '../../StepTitle/StepTitle';
import ShelterCard from '../ShelterCard/ShelterCard';
import styles from './ShelterSection.module.scss';
import { useShelterList } from '@/hooks/useShelterList';

type ShelterSectionProps = {
  selectedShelterId: number;
  onSelectShelter: (id: number, name: string) => void;
};

export default function ShelterSection({
  selectedShelterId,
  onSelectShelter,
}: ShelterSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<'dogcount' | 'reliability'>('dogcount');
  
  // useShelterList 훅 사용
  const { shelters, isLoading, error } = useShelterList(sort);

  // 검색 처리
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // 검색어를 기준으로 단체 필터링
  const filteredShelters = searchTerm
    ? shelters.filter((shelter) =>
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : shelters;

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div>
        <StepTitle number={1} title='후원할 단체 선택' />
        <div className={styles.loading}>단체 목록을 불러오는 중입니다...</div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div>
        <StepTitle number={1} title='후원할 단체 선택' />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <StepTitle number={1} title='후원할 단체 선택' />

      <SearchBar
        onSearch={handleSearch}
        placeholder='단체명을 입력해주세요'
        fullWidth
      />

      {filteredShelters.length > 0 ? (
        <div className={styles.shelterList}>
          {filteredShelters.map((shelter) => (
            <ShelterCard
              key={shelter.shelterId}
              id={shelter.shelterId}
              name={shelter.name}
              imageUrl={shelter.imageUrl || ''}
              isSelected={selectedShelterId === shelter.shelterId}
              isRecent={false} // 새 훅에서는 isRecent 정보가 없으므로 false로 설정
              onClick={onSelectShelter}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>검색 결과가 없습니다.</div>
      )}
    </div>
  );
}