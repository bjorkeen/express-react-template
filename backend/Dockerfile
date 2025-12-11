FROM node:18-alpine

WORKDIR /app

RUN chown -R node:node /app

COPY package*.json ./

RUN npm install --production

COPY --chown=node:node . .


USER node

EXPOSE 5050

CMD ["node", "index.js"]
