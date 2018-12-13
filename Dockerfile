FROM node AS builder
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm i && npm i -g @angular/cli@~7.0.0 && npm uninstall --save node-sass && npm install --save node-sass && npm run build

FROM nginx:stable-alpine

COPY --from=builder /usr/src/app/www /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
