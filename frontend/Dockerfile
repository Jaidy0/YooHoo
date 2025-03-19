# 1. 빌더 단계
FROM node:18 AS builder

# Corepack 캐시 디렉토리 고정
ENV COREPACK_HOME=/app/.corepack

# Corepack 활성화
RUN corepack enable

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package.json yarn.lock ./

# Yarn 설정
RUN echo "nodeLinker: node-modules" > .yarnrc.yml

# Yarn 4.7.0 준비 및 활성화
RUN corepack prepare yarn@4.7.0 --activate

# 의존성 설치
RUN yarn install --immutable

# 애플리케이션 코드 복사
COPY . .

# Next.js 빌드
RUN yarn build

# 2. 실행 단계
FROM node:18 AS runner

# Corepack 활성화 (필요 시)
RUN corepack enable

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 앱 및 실행에 필요한 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

# Yarn 실행 파일 복사 (Corepack이 다운로드한 파일)
COPY --from=builder /app/.corepack/yarn/4.7.0/yarn-4.7.0.cjs /app/.yarn/releases/yarn-4.7.0.cjs

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["yarn", "start"]