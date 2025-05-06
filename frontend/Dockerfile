FROM node:18.20.4 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]