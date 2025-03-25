'use client';

import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import StepTitle from '../../StepTitle/StepTitle';

type ShelterSectionProps = {
  selectedShelterId: number;
  onSelectShelter: (id: number, name: string) => void;
};

export default function ShelterSection({
  selectedShelterId,
  onSelectShelter,
}: ShelterSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 검색 처리
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <StepTitle number={1} title='후원할 단체 선택' />

      <SearchBar
        onSearch={handleSearch}
        placeholder='찾으시는 단체 이름을 입력해주세요.'
        fullWidth
      />
    </div>
  );
}
