FROM node:18

WORKDIR /pcrs-hints

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/src/main.js" ]