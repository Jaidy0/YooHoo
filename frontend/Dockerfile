# 1. 빌드 단계
# Node.js 공식 이미지 사용
FROM node:18 AS builder  # builder로 이름을 지정

# Corepack 활성화
RUN corepack enable

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json yarn.lock ./

# 올바른 Yarn 버전 사용하도록 Corepack 업데이트
RUN corepack prepare yarn@4.7.0 --activate

# 의존성 설치
RUN yarn install --frozen-lockfile

# 앱 코드 복사
COPY . .

# Next.js 빌드
RUN yarn build

# 2. 실행 단계
FROM node:18 AS runner

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 파일과 필요한 파일만 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# 환경 변수 설정 (PORT 지정 가능)
ENV NODE_ENV=production
ENV PORT=3000

# 컨테이너가 3000번 포트에서 실행되도록 설정
EXPOSE 3000

# Next.js 서버 실행
CMD ["yarn", "start"]
