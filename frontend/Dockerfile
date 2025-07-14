FROM node:lts-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:4000/api

RUN npm run build

EXPOSE 5000

CMD [ "npm", "run", "start" ]