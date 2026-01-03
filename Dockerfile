FROM node:alpine

WORKDIR /app

COPY package.json ./

# No dependencies to install for this Zero Dependency project
# but if added later: RUN npm install --production

COPY . .

ENV PORT=3002
ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "server.js"]