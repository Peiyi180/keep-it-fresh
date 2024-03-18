# reference: https://javascript.plainenglish.io/how-to-serve-a-react-app-with-nginx-in-a-non-root-docker-container-cbc4c6acc177
FROM node:18.12.1-buster-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
COPY public/ public/
COPY src/ src/
RUN npm ci
RUN npm run build

FROM nginx:1.23.2-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE 8080