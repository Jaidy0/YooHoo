# 1. 빌드 단계
FROM node:18 AS builder

# Corepack 명시적 활성화 및 Yarn 버전 준비
RUN corepack enable && corepack prepare yarn@4.7.0 --activate

WORKDIR /app

# 의존성 파일 복사
COPY package.json yarn.lock .yarnrc.yml ./

COPY .yarn ./.yarn

# Yarn 캐시 디렉토리 생성 및 의존성 설치
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --immutable

# 앱 코드 복사
COPY . .

# Next.js 빌드
RUN yarn build

# 2. 실행 단계
FROM node:18 AS runner

# Corepack 활성화 및 Yarn 버전 준비
RUN corepack enable && corepack prepare yarn@4.7.0 --activate

WORKDIR /app

# 필수 파일 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

# Yarn 실행을 위해 필요한 파일 복사
COPY --from=builder /usr/local/bin/yarn /usr/local/bin/yarn
COPY --from=builder /usr/local/share/yarn /usr/local/share/yarn

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]