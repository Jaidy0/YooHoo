# Build 단계
FROM node:18 AS builder
WORKDIR /app
# package-lock.json이 존재한다면 함께 복사 (없으면 package.json만 복사하거나 해당 부분을 수정)
COPY package.json package-lock.json ./
# 의존성 설치 시 --legacy-peer-deps 옵션 사용
RUN npm install --legacy-peer-deps
COPY . .
# Next.js 빌드 실행 (build 스크립트는 package.json에 정의되어 있어야 합니다)
RUN npm run build
# 정적 사이트 export (out 폴더에 결과물이 생성됨)
RUN npm run export

# 배포 단계 (nginx를 이용하여 정적 파일 제공)
FROM nginx:alpine
# Nginx 기본 HTML 폴더 생성
RUN mkdir -p /usr/share/nginx/html
# builder 단계에서 생성한 정적 파일(out 폴더)을 Nginx의 HTML 폴더로 복사
COPY --from=builder /app/out /usr/share/nginx/html
# 프로젝트 루트의 nginx 폴더 안에 있는 nginx.conf 파일을 복사
# COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
