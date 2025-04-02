# Multi-stage build

# 1단계: 환경 설정 및 dependancy 설치
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

# 명령어를 실행할 디렉터리 지정
WORKDIR /usr/src/app

# 패키지 매니저 설정 파일 및 .yarn 디렉토리 복사
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Yarn 활성화 (버전 설정 제거)
RUN corepack enable
RUN yarn install --immutable

###########################################################

# 2단계: next.js 빌드 단계
FROM node:18-alpine AS builder

# 빌드 시 전달된 인자 정의
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_KAKAO_CLIENT_ID
ARG NEXT_PUBLIC_KAKAO_REDIRECT_URI

# 환경 변수 설정
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_KAKAO_CLIENT_ID=${NEXT_PUBLIC_KAKAO_CLIENT_ID}
ENV NEXT_PUBLIC_KAKAO_REDIRECT_URI=${NEXT_PUBLIC_KAKAO_REDIRECT_URI}

# 명령어를 실행할 디렉터리 지정
WORKDIR /usr/src/app

# 패키지 매니저 설정 및 node_modules 복사
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/.yarn ./.yarn
COPY --from=deps /usr/src/app/.yarnrc.yml ./
COPY . .

# 빌드 실행
RUN corepack enable
RUN yarn build --no-lint

###########################################################


# 3단계: 실행 환경 (runner)
FROM node:18-alpine AS runner
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
