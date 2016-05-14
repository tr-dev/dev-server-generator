FROM node:4.4
RUN  mkdir /app
COPY . /app
WORKDIR /app
RUN npm install
CMD node app.js