import axios from 'axios';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

// 날짜 범위로 후원 내역 필터링
export const fetchDonations = async (params: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/donations/filter`,
      params,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('후원 상세 내역 조회 실패:', error);
    throw error;
  }
};

// 사용자 후원 정보 가져오기
export const getUserDonations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/donations`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('후원 내역 조회 실패:', error);
    return [];
  }
};
