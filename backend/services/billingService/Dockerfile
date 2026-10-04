FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./services/billingService/package*.json ./services/billingService/
RUN cd ./services/billingService && npm install
COPY services/billingService ./services/billingService
COPY caching ./caching
WORKDIR /app/billingService
EXPOSE 5555
CMD ["npm", "start"]