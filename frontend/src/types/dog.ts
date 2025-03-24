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

// 강아지 기본 정보 인터페이스 (실제 API 응답 기반)
export interface Dog {
  dogId: number;
  shelterId?: number; // API 응답에 없을 수 있으므로 선택적 필드로 설정
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
  admissionDate: string; // ISO 형식의 날짜 문자열 (예: "2024-02-16T15:00:00.000+00:00")
  images?: DogImage[]; // 이미지 정보 배열
}

// 목록에서 사용하는 축약된 정보
export interface DogSummary {
  dogId: number;
  name: string;
  age: number;
  gender: Gender;
  status: DogStatus;
  mainImage?: DogImage; // 대표 이미지 (isMain이 true인 이미지)
  shelterId?: number;
}

// 강아지 이미지 인터페이스
export interface DogImage {
  imageId: number;
  dogId: number;
  imageUrl: string;
  thumbnailUrl?: string;
  isMain: boolean;
  uploadDate: string;
}

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

// 이미지 응답 인터페이스
export interface DogImagesResponse {
  data: DogImage[];
  dogId: number;
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

// 강아지 이미지 업로드 요청 인터페이스
export interface DogImageUploadRequest {
  dogId: number;
  isMain: boolean;
  file: File;
}

// 강아지 이미지 수정 요청 인터페이스
export interface DogImageUpdateRequest {
  imageId: number;
  isMain?: boolean;
}
