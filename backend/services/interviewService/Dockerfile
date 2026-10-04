FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./services/interviewService/package*.json ./services/interviewService/
RUN cd ./services/interviewService && npm install
COPY services/interviewService ./services/interviewService
COPY caching ./caching
WORKDIR /app/interviewService
EXPOSE 6666
CMD ["npm", "start"]