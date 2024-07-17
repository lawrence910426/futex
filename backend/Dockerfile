FROM node:20-alpine3.19

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --legacy-peer-deps

COPY . .

WORKDIR /app/scripts
CMD ["sh", "internal-deploy.sh"]
