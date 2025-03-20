# 1단계: 의존성 설치
FROM node:18-alpine AS deps
WORKDIR /app
# Yarn을 글로벌로 설치합니다.
RUN npm install --global yarn
# yarn.lock 파일이 있다면 함께 복사합니다.
COPY package.json yarn.lock* ./
RUN yarn install

# 2단계: 빌드
FROM node:18-alpine AS builder
WORKDIR /app
# 전체 소스 코드를 복사합니다.
COPY . .
# 이전 단계에서 설치한 node_modules를 복사합니다.
COPY --from=deps /app/node_modules ./node_modules
# Next.js 애플리케이션 빌드
RUN yarn build

# 3단계: 런타임 이미지
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js 기본 포트는 3000번입니다.
EXPOSE 3000

# 프로덕션에 필요한 파일들만 복사합니다.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# 애플리케이션 실행
CMD ["yarn", "start"]
