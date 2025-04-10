import axios from 'axios';
import { ReliabilityResponse, ShelterDetail } from '@/types/shelter';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';
/**
 * 보호소 상세 정보를 가져오는 API
 * @param shelterId 보호소 ID
 * @returns 보호소 상세 정보
 */
export const getShelterDetail = async (
  shelterId: number
): Promise<ShelterDetail> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/shelter/${shelterId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`보호소 ID ${shelterId} 정보 조회 실패:`, error);
    throw error;
  }
};

/**
 * 보호소별 강아지 상태 개수를 가져오는 API
 * @param shelterId 보호소 ID
 * @returns 상태별 강아지 수 (입양, 보호, 구조)
 */
export const getDogCountByShelter = async (
  shelterId: number
): Promise<{
  adoption: number;
  protection: number;
  rescue: number;
}> => {
  try {
    // 중요: withCredentials 설정을 유지하고 직접 세션 쿠키 확인
    console.log('현재 쿠키:', document.cookie);

    const response = await axios.get(
      `${API_BASE_URL}/api/dogs/status?shelterId=${shelterId}`,
      {
        withCredentials: true, // 인증 정보 전송 필요
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    // 에러 처리
    console.error(
      `보호소 ID ${shelterId}의 강아지 상태 통계 조회 실패:`,
      error
    );

    // 대체 데이터 반환 (테스트용)
    console.warn('에러 발생으로 기본값 반환');
    return {
      adoption: 0,
      protection: 0,
      rescue: 0,
    };
  }
};

// 후원했던 단체 조회
export const getRecentDonatedShelters = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/donations/shelters`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('최근 후원 단체 조회 실패:', error);
    return [];
  }
};

/**
 * 보호소의 신뢰지수 정보를 가져오는 API
 * @param shelterId 보호소 ID
 * @returns 신뢰지수 정보
 */

export const getShelterReliability = async (
  shelterId: number
): Promise<ReliabilityResponse> => {
  try {
    const response = await axios.get<ReliabilityResponse>(
      `${API_BASE_URL}/api/shelter/${shelterId}/reliability`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`보호소 ID ${shelterId}의 신뢰지수 조회 실패:`, error);
    throw error;
  }
};
