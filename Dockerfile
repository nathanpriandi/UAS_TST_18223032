FROM node:alpine

WORKDIR /app

COPY package.json ./

COPY . .

ENV PORT=3002
ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "server.js"]