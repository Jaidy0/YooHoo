// src/hooks/useCategoryPercentages.ts
import { useQuery } from '@tanstack/react-query';
import {
  fetchWithdrawalCategoryPercentages,
  CategoryPercentage,
} from '@/api/donations/donation';

interface CategoryWithColor extends CategoryPercentage {
  color: string;
}

// 카테고리별 색상 매핑
const categoryColors: { [key: string]: string } = {
  인건비: '#f57c17',
  '시설 유지비': '#f2b2d1',
  의료비: '#ee417c',
  물품구매: '#f4b616',
  기타: '#1bb9b3',
};

export function useCategoryPercentages(shelterId: number) {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categoryPercentages', shelterId],
    queryFn: async () => {
      if (!shelterId) {
        throw new Error('보호소 ID가 필요합니다.');
      }
      
      const data = await fetchWithdrawalCategoryPercentages(shelterId);
      
      // 데이터에 색상 추가
      return data.map((category) => ({
        ...category,
        color: categoryColors[category.name] || '#7a91e0', // 기본 색상
      }));
    },
    enabled: !!shelterId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return { 
    categories, 
    isLoading, 
    error: error as Error | null 
  };
}
