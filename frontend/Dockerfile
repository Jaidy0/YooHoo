# 1. 빌드 단계
FROM node:18 AS builder

# Corepack 활성화
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

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["yarn", "start"]