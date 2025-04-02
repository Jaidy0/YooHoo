import axios from 'axios';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

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
