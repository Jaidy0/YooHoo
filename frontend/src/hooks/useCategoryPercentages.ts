// src/hooks/useCategoryPercentages.ts
import { useState, useEffect } from 'react';
import {
  fetchWithdrawalCategoryPercentages,
  CategoryPercentage,
} from '@/api/donations/donation';

interface CategoryWithColor extends CategoryPercentage {
  color: string;
}

export function useCategoryPercentages(shelterId: number) {
  const [categories, setCategories] = useState<CategoryWithColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 카테고리별 색상 매핑
  const categoryColors: { [key: string]: string } = {
    인건비: '#f57c17',
    '시설 유지비': '#f2b2d1',
    의료비: '#ee417c',
    물품구매: '#f4b616',
    기타: '#1bb9b3',
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!shelterId) {
        setError(new Error('보호소 ID가 필요합니다.'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchWithdrawalCategoryPercentages(shelterId);

        // 데이터에 색상 추가
        const categoriesWithColor = data.map((category) => ({
          ...category,
          color: categoryColors[category.name] || '#7a91e0', // 기본 색상
        }));

        setCategories(categoriesWithColor);
        setError(null);
      } catch (err) {
        console.error('카테고리 데이터 로드 에러:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('카테고리 데이터를 불러오는데 실패했습니다.')
        );
        // 에러 발생 시 빈 배열 설정
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shelterId]);

  return { categories, isLoading, error };
}
