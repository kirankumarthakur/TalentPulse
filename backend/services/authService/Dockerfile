FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./services/authService/package*.json ./services/authService/
RUN cd services/authService && npm install
COPY services/authService ./services/authService
COPY caching ./caching
WORKDIR /app/services/authService
EXPOSE 8888
CMD ["npm", "start"]