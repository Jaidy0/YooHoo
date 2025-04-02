// src/mocks/handlers/index.ts
import { dogsHandlers } from './dogs';
import { loginHandlers } from './login';
import type { RequestHandler } from 'msw';

// handlers를 RequestHandler[] 타입으로 명시적 선언
export const handlers: RequestHandler[] = [...dogsHandlers, ...loginHandlers];
