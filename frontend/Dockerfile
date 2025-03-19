# 1. 빌드 단계
FROM node:18 AS builder

# Yarn 4.7.0 직접 설치
RUN npm install -g yarn@4.7.0

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --immutable

# 앱 코드 복사
COPY . .

# Next.js 빌드
RUN yarn build

# 2. 실행 단계
FROM node:18 AS runner

# Yarn 4.7.0 직접 설치
RUN npm install -g yarn@4.7.0

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 앱 및 실행에 필요한 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["yarn", "start"]