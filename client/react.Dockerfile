FROM node:18.5

WORKDIR /usr/src/client

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]