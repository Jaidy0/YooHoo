FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
# COPY ../nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]