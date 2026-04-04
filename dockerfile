FROM node:20.19.3

WORKDIR /app/scolarite/

COPY package*.json ./

RUN  npm install 

COPY . .

EXPOSE 3000

CMD [ "npm","start" ]