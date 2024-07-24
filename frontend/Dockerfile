FROM node:20-alpine3.19

WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

