// src/mocks/index.ts
async function initMocks() {
  // 개발 환경에서만 MSW 실행
  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment detected, initializing MSW...');
    if (typeof window === 'undefined') {
      const { server } = await import('./server');
      server.listen({
        onUnhandledRequest: 'bypass',
      });
    } else {
      const { worker } = await import('./browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
    }
    console.log('MSW initialized in development mode');
  }
}

// // 개발 환경에서 initMocks 함수 호출 추가
// if (process.env.NODE_ENV === 'development') {
//   console.log('Development environment detected, initializing MSW...');
//   initMocks();
// }

export default initMocks;
