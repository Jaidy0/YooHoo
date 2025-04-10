import axios from 'axios';
const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

export interface UploadReceiptResponse {
  url: string;
}

/**
 * 영수증 이미지 업로드 API
 * @param withdrawId 출금 ID
 * @param file 업로드할 영수증 이미지 파일
 */
export const uploadReceipt = async (
  withdrawId: number,
  file: File
): Promise<UploadReceiptResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<UploadReceiptResponse>(
    `${API_BASE_URL}/api/withdrawal/${withdrawId}/imageupload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
/**
 * 영수증 이미지 URL 조회 API
 * @param withdrawId 출금 ID
 */
export const getReceiptFileUrl = async (
  withdrawId: number
): Promise<string> => {
  const response = await axios.get<{ fileUrl: string }>(
    `${API_BASE_URL}/api/withdrawal/${withdrawId}/fileUrl`
  );

  return response.data.fileUrl;
};
/**
 * 영수증 삭제 API
 * @param withdrawId 출금 ID
 */
export const deleteReceipt = async (
  withdrawId: number
): Promise<{ success: boolean }> => {
  const response = await axios.delete<{ success: boolean }>(
    `${API_BASE_URL}/api/withdrawal/${withdrawId}/receipt`
  );

  return response.data;
};
