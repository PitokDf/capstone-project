FROM node:lts-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma prisma

RUN npm run popinstall

COPY . .

RUN npm run build

EXPOSE 2222

CMD [ "node", "dist/src/server.js" ]