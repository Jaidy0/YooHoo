# 1. 빌드 단계
FROM node:18 AS builder

# Corepack 활성화 (Yarn 4 사용을 위한 필수 작업)
RUN corepack enable

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json yarn.lock ./

# Yarn 설정: node_modules 사용
RUN echo "nodeLinker: node-modules" > .yarnrc.yml

# 올바른 Yarn 버전 사용하도록 Corepack 업데이트
RUN corepack prepare yarn@4.7.0 --activate

# 의존성 설치
RUN yarn install --immutable

# 앱 코드 복사
COPY . .

# Next.js 빌드
RUN yarn build

# 2. 실행 단계
FROM node:18 AS runner

# Corepack 활성화 (Yarn 4 실행을 위해 필요)
RUN corepack enable
RUN corepack prepare yarn@4.7.0 --activate

WORKDIR /app

# 빌드된 앱 및 실행에 필요한 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# 중요: Yarn 4 실행을 위해 .yarn 복사
COPY --from=builder /app/.yarn ./
# Yarn 설정 파일 복사
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["yarn", "start"]
