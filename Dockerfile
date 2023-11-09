FROM node:14.8.0-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install sockjs-client && npm install --force
COPY . /app/
RUN npm run build

# Production
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
