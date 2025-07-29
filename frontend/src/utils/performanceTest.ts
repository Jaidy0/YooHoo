/**
 * 성능 테스트 유틸리티 함수들
 */

// 렌더링 시간 측정
export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    console.log(`[성능 측정] ${componentName} 렌더링 시간: ${renderTime.toFixed(2)}ms`);
    
    // 성능 임계값 체크 (100ms 이상이면 경고)
    if (renderTime > 100) {
      console.warn(`[성능 경고] ${componentName} 렌더링이 느립니다: ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  };
};

// 메모리 사용량 측정
export const measureMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log(`[메모리 사용량] 
      - 사용 중: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB
      - 총 할당: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB
      - 제한: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB
    `);
  }
};

// API 응답 시간 측정
export const measureApiResponseTime = async <T>(
  apiCall: () => Promise<T>,
  apiName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    console.log(`[API 성능] ${apiName} 응답 시간: ${responseTime.toFixed(2)}ms`);
    
    // API 응답 시간 임계값 체크 (1초 이상이면 경고)
    if (responseTime > 1000) {
      console.warn(`[API 경고] ${apiName} 응답이 느립니다: ${responseTime.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    console.error(`[API 에러] ${apiName} 실패 (${responseTime.toFixed(2)}ms):`, error);
    throw error;
  }
};

// 컴포넌트 리렌더링 횟수 추적
export const createRenderCounter = (componentName: string) => {
  let renderCount = 0;
  
  return () => {
    renderCount++;
    console.log(`[리렌더링] ${componentName} 렌더링 횟수: ${renderCount}회`);
    
    // 과도한 리렌더링 체크 (10회 이상이면 경고)
    if (renderCount > 10) {
      console.warn(`[리렌더링 경고] ${componentName}이 과도하게 리렌더링되고 있습니다: ${renderCount}회`);
    }
    
    return renderCount;
  };
};

// 성능 메트릭 수집
export const collectPerformanceMetrics = () => {
  const metrics = {
    // Core Web Vitals
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
  };

  // First Contentful Paint
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
          console.log(`[Core Web Vitals] FCP: ${metrics.fcp.toFixed(2)}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['paint'] });
  }

  // Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.lcp = entry.startTime;
        console.log(`[Core Web Vitals] LCP: ${metrics.lcp.toFixed(2)}ms`);
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  return metrics;
};

// 성능 최적화 권장사항 생성
export const generatePerformanceRecommendations = (metrics: any) => {
  const recommendations = [];

  if (metrics.fcp > 1800) {
    recommendations.push('FCP가 1.8초를 초과합니다. 초기 로딩 성능을 개선해주세요.');
  }

  if (metrics.lcp > 2500) {
    recommendations.push('LCP가 2.5초를 초과합니다. 주요 콘텐츠 로딩을 최적화해주세요.');
  }

  if (metrics.fid > 100) {
    recommendations.push('FID가 100ms를 초과합니다. 상호작용 응답성을 개선해주세요.');
  }

  if (metrics.cls > 0.1) {
    recommendations.push('CLS가 0.1을 초과합니다. 레이아웃 안정성을 개선해주세요.');
  }

  return recommendations;
};

// 성능 테스트 실행 함수
export const runPerformanceTest = async () => {
  console.log('=== 성능 테스트 시작 ===');
  
  // 메모리 사용량 측정
  measureMemoryUsage();
  
  // 성능 메트릭 수집
  const metrics = collectPerformanceMetrics();
  
  // 권장사항 생성
  const recommendations = generatePerformanceRecommendations(metrics);
  
  if (recommendations.length > 0) {
    console.log('=== 성능 개선 권장사항 ===');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  console.log('=== 성능 테스트 완료 ===');
  
  return { metrics, recommendations };
}; 