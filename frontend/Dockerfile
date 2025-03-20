# 1단계: 의존성 설치 (deps)
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

# 패키지 매니저 설정
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn set version 4.7.0
RUN yarn install --frozen-lockfile --production

# 2단계: 애플리케이션 빌드 (builder)
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# 의존성 복사
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# 빌드 환경 설정
ENV NODE_ENV production
RUN yarn build

# 3단계: 실행 환경 (runner)
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

# 시스템 사용자 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 빌드 결과물 복사
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "server.js"]
