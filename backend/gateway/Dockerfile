FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./gateway/package*.json ./gateway/
RUN cd ./gateway && npm install
COPY gateway ./gateway
COPY caching ./caching
WORKDIR /app/gateway
EXPOSE 9999
CMD ["npm", "start"]