# ============================================
# ai-hackathon-frontend Dockerfile
# React + Vite + Nginx
# ============================================

# ----- Build Stage -----
FROM node:20-alpine AS builder
WORKDIR /app

# 의존성 설치 (캐싱 활용)
COPY package*.json ./
RUN npm ci

# 소스 복사 & 빌드
COPY . .
RUN npm run build


# ----- Run Stage -----
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# Vite 빌드 결과물 복사 (dist 폴더)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]