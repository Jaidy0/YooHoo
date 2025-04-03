/**
 * 날짜 문자열(YYYYMMDD)을 형식화된 날짜(YYYY-MM-DD)로 변환
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) {
    return dateStr;
  }
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
};

/**
 * 시간 문자열(HHMMSS)을 형식화된 시간(HH:MM:SS)으로 변환
 */
export const formatTime = (timeStr: string): string => {
  if (!timeStr || timeStr.length !== 6) {
    return timeStr;
  }
  return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}:${timeStr.substring(4, 6)}`;
};

/**
 * 숫자를 형식화된 통화 문자열로 변환
 */
export const formatCurrency = (amount: string | number): string => {
  const value = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  if (isNaN(value)) {
    return '0원';
  }
  return new Intl.NumberFormat('ko-KR').format(value) + '원';
};
