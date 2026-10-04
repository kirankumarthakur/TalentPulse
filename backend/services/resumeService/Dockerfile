FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./services/resumeService/package*.json ./services/resumeService/
RUN cd ./services/resumeService && npm install
COPY services/resumeService ./services/resumeService
COPY caching ./caching
WORKDIR /app/resumeService
EXPOSE 7777
CMD ["npm", "start"]