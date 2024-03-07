FROM node:20.11.0

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

ENV CHOKIDAR_USEPOLLING=true

COPY . /app

CMD ["npm", "start"]

EXPOSE 3000