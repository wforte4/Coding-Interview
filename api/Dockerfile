FROM node:8
WORKDIR /api
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
EXPOSE 6001
EXPOSE 9200
CMD [ "pm2-runtime", "start", "server.js"]