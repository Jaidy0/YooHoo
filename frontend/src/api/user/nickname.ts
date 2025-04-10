import axios from 'axios';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

// 닉네임 수정 API
export const updateUserNickname = async (
  userId: number,
  newNickname: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/auth/${userId}/nickname`,
      { newNickname },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('닉네임 수정 실패:', error);
    throw error;
  }
};
