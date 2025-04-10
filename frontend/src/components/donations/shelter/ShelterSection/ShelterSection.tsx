'use client';

import { useState, useEffect, useRef } from 'react';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import StepTitle from '../../StepTitle/StepTitle';
import ShelterCard from '../ShelterCard/ShelterCard';
import styles from './ShelterSection.module.scss';
import { useDonationShelterList } from '@/hooks/donations/useDonationShelterList';

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
  const [initialRender, setInitialRender] = useState(true);
  const [shouldScroll, setShouldScroll] = useState(false);

  // 선택된 요소에 대한 ref
  const selectedShelterRef = useRef<HTMLDivElement>(null);

  // useShelterList 훅 사용
  const { shelters, isLoading, error } = useDonationShelterList(sort);

  // 검색 처리
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // 검색어가 초기화되면 스크롤 플래그 활성화
    if (term === '' && selectedShelterId) {
      setShouldScroll(true);
    }
  };

  // 검색어를 기준으로 단체 필터링
  let filteredShelters = searchTerm
    ? shelters.filter((shelter) =>
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [...shelters]; // 배열 복사

  // 최근 후원한 단체를 상단에 정렬 (isRecent가 true인 항목이 먼저 오도록)
  filteredShelters.sort((a, b) => {
    const aIsRecent = (a as any).isRecent || false;
    const bIsRecent = (b as any).isRecent || false;

    // bIsRecent가 true면 1, false면 0
    // aIsRecent가 true면 1, false면 0
    // true인 항목이 더 앞에 오도록 b - a 순서로 계산
    return (bIsRecent ? 1 : 0) - (aIsRecent ? 1 : 0);
  });

  // 초기 렌더링 시 단체가 선택되어 있으면 스크롤하기
  useEffect(() => {
    // 단체 목록이 로드되었고, 선택된 단체가 있으며, 초기 렌더링인 경우에만 실행
    if (
      !isLoading &&
      selectedShelterId &&
      initialRender &&
      filteredShelters.length > 0
    ) {
      setShouldScroll(true);
      setInitialRender(false);
    }
  }, [isLoading, selectedShelterId, initialRender, filteredShelters.length]);

  // 선택된 요소로 스크롤 처리
  useEffect(() => {
    if (shouldScroll && selectedShelterId && selectedShelterRef.current) {
      selectedShelterRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setShouldScroll(false); // 스크롤 후 플래그 초기화
    }
  }, [shouldScroll, selectedShelterId, filteredShelters]);

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
        initialValue={searchTerm}
      />

      {filteredShelters.length > 0 ? (
        <div className={styles.shelterList}>
          {filteredShelters.map((shelter) => {
            const isSelected = selectedShelterId === shelter.shelterId;
            const isRecent = (shelter as any).isRecent || false;
            return (
              <div
                key={shelter.shelterId}
                ref={isSelected ? selectedShelterRef : null}
              >
                <ShelterCard
                  id={shelter.shelterId}
                  name={shelter.name}
                  imageUrl={shelter.imageUrl || ''}
                  isSelected={isSelected}
                  isRecent={isRecent}
                  onClick={onSelectShelter}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.noResults}>검색 결과가 없습니다.</div>
      )}
    </div>
  );
}
