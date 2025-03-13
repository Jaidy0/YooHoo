// src/mocks/handlers/dogs.ts
import { http, HttpResponse } from 'msw';

export const dogsHandlers = [
  // 유기견 목록 가져오기
  http.get('/api/dogs', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: '멍멍이',
        breed: '리트리버',
        age: 3,
        imageUrl: '/images/dog1.jpg',
        description: '활발하고 친절한 성격의 유기견입니다.',
        status: 'available',
      },
      {
        id: '2',
        name: '초코',
        breed: '시바견',
        age: 2,
        imageUrl: '/images/dog2.jpg',
        description: '온순하고 애교 많은 유기견입니다.',
        status: 'available',
      },
    ]);
  }),

  // 특정 유기견 상세 정보
  http.get('/api/dogs/:id', ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      id,
      name: id === '1' ? '멍멍이' : '초코',
      breed: id === '1' ? '리트리버' : '시바견',
      age: id === '1' ? 3 : 2,
      imageUrl: `/images/dog${id}.jpg`,
      description:
        id === '1'
          ? '활발하고 친절한 성격의 유기견입니다.'
          : '온순하고 애교 많은 유기견입니다.',
      status: 'available',
      medicalHistory: '모든 예방 접종 완료',
      adoptionRequirements: '안정된 주거 환경 필요',
    });
  }),
];
