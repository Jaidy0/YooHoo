// 보호소 상세 정보 타입
export interface ShelterDetail {
  shelterId: number;
  name: string;
  address: string;
  foundationDate: string;
  content: string;
  email: string;
  phone: string;
  businessNumber: string;
  reliability: number;
  imageUrl: string;
  dogScore: number;
  fileScore: number;
  foundationScore: number;
}

export interface Shelter {
  shelterId: number;
  name: string;
  content: string;
  dogCount: number;
  reliability: number;
  imageUrl: string;
  foundation_date: string;
}

export interface ShelterAccountInfo {
  accountNo: string;
  bankName: string;
}

// 신뢰지수 응답 타입
export interface ReliabilityResponse {
  shelterId: number;
  reliabilityScore: number;
  dogScore: number;
  fileScore: number;
  foundationScore: number;
}
