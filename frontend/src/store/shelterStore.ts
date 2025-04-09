import { create } from 'zustand';
import { ShelterDetail } from '@/types/shelter';
import { getShelterDetail } from '@/api/shelter/shelter';

interface ShelterState {
  shelter: ShelterDetail | null;
  isLoading: boolean;
  error: string | null;
  fetchShelterData: (shelterId: number) => Promise<{
    isShelterExist: boolean;
  }>;
  clearShelterData: () => void;
}

// 쉘터 스토어 생성
export const useShelterStore = create<ShelterState>((set) => ({
  shelter: null,
  isLoading: false,
  error: null,

  // shelterId를 매개변수로 받도록 수정
  fetchShelterData: async (shelterId: number) => {
    try {
      // shelterId가 없으면 쉘터가 없는 것으로 처리
      if (!shelterId) {
        set({
          shelter: null,
          isLoading: false,
          error: null,
        });
        return { isShelterExist: false };
      }

      set({ isLoading: true, error: null });

      // shelterId로 쉘터 정보 가져오기
      const shelterData = await getShelterDetail(shelterId);

      if (!shelterData) {
        set({
          shelter: null,
          isLoading: false,
        });
        return { isShelterExist: false };
      }

      // 상태 업데이트
      set({
        shelter: shelterData,
        isLoading: false,
        error: null,
      });

      console.log('쉘터 데이터 로드 성공:', shelterData);
      return { isShelterExist: true };
    } catch (error) {
      console.error('쉘터 정보 로드 실패:', error);
      set({
        shelter: null,
        isLoading: false,
        error: '쉘터 정보를 가져오는 중 오류가 발생했습니다.',
      });
      return { isShelterExist: false };
    }
  },

  // 쉘터 데이터 초기화 (로그아웃 시 호출)
  clearShelterData: () => {
    set({
      shelter: null,
      isLoading: false,
      error: null,
    });
  },
}));
