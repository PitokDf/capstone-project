FROM node:18.20.4 AS builder

WORKDIR /app

COPY package*.json ./

# RUN apt-get update -y && apt-get install -y openssl
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .
RUN npx prisma generate

EXPOSE 2222

CMD [ "npm", "run", "dev" ]