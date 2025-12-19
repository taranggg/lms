# /client/Dockerfile

FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# React default port
EXPOSE 3000

# Start React in development mode
CMD ["npm","run","dev"]