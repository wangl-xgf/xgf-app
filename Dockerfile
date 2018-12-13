FROM node:11.2.0 AS builder
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm config set registry https://registry.npm.taobao.org && npm i && npm rebuild node-sass --force && npm i -g @angular/cli@~7.0.0 && npm run build

FROM nginx:stable-alpine

COPY --from=builder /usr/src/app/www /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
