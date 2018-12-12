FROM node AS builder
WORKDIR /app
COPY . /app
RUN yarn && yarn run build

FROM nginx:stable-alpine

COPY --from=builder /app/www /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]