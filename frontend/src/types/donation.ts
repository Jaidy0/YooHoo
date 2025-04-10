// 후원 내역 인터페이스
export interface Donation {
  donationId: number;
  donationAmount: number;
  transactionUniqueNo: string;
  donationDate: string;
  depositorName: string;
  cheeringMessage: string;
  userNickname: string | null;
  dogName: string | null;
  shelterName: string;
}

// 차트 데이터 인터페이스
export interface ChartData {
  labels: string[];
  values: number[];
}

// 리포트 데이터 인터페이스
export interface ReportData {
  donationType: ChartData;
  weeklyDonation: {
    labels: string[];
    values: number[];
    totalCount: number;
    recentPeriods: number;
  };
  shelterDonation: ChartData;
  username: string;
}
// 폼 데이터 타입 (클라이언트 상에서 사용)
export interface DonationFormData {
  shelterId: number; // 단체 ID (shelterId)
  shelterName: string; // 단체 이름 (화면 표시용)
  shelterAccountNumber: string;
  donationType: 0 | 1; // 0: 정기 후원, 1: 일시 후원
  paymentDay: number; // 정기 결제일 (1-28)
  targetType: 'shelter' | 'dog'; // 단체 또는 강아지 지정 후원 (UI 구분용)
  dogId: number; // 강아지 ID
  dogName: string; // 강아지 이름 (화면 표시용)
  accountName: string; // 입금자명
  accountNumber: string; // 출금 계좌번호
  supportMessage: string; // 응원 메시지
  anonymousDonation: boolean; // 익명 여부
  amount: number; // 후원 금액
  isRecent?: boolean; // 재후원 여부 (UI 구분용)
}
