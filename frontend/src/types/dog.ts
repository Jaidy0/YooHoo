// types/dog.ts

// 강아지 상태 enum
export enum DogStatus {
  PROTECTED = 0, // 보호
  TEMPORARY = 1, // 임시보호
  ADOPTED = 2, // 입양
  DECEASED = 3, // 사망
}

// 성별 enum
export enum Gender {
  MALE = 0,
  FEMALE = 1,
}

// API 응답에 맞춘 강아지 기본 정보 인터페이스
export interface Dog {
  dogId: number;
  name: string;
  age: number;
  weight: number;
  gender: Gender;
  breed: string;
  energetic: number; // 활발함 정도 (1-5 스케일)
  familiarity: number; // 친화력 정도 (1-5 스케일)
  isVaccination: boolean;
  isNeutered: boolean;
  status: DogStatus;
  admissionDate: string; // 날짜 형식 (예: "2025-03-26")
  imageUrl: string | null; // 이미지 URL(없을 수 있음)
  shelterId?: number; // API 응답에 없을 수 있으므로 선택적 필드로 설정
}

// 리스트 응답용 타입 (API 응답 형식에 맞춤)
export type DogSummary = Dog;

// API 응답 인터페이스
export interface DogResponse {
  data: Dog[];
  total: number;
  page: number;
  size: number;
}

// 단일 강아지 응답 인터페이스
export interface SingleDogResponse {
  data: Dog;
}

// 강아지 생성/수정 요청 인터페이스
export interface DogRequest {
  name: string;
  age: number;
  weight: number;
  gender: Gender;
  breed: string;
  energetic: number;
  familiarity: number;
  isVaccination: boolean;
  isNeutered: boolean;
  status: DogStatus;
  admissionDate: string;
  shelterId: number;
  description?: string;
}

// 이미지 업로드 요청 인터페이스
export interface DogImageUploadRequest {
  dogId: number;
  file: File;
}
