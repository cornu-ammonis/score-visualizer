FROM node:boron
RUN mkdir -p /usr/src/app
RUN mkdir /usr/src/app/data
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000

#RUN node main.js
