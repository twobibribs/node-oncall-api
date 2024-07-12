FROM node:17
# Create app directory
WORKDIR /usr/src/app
LABEL owner=me@neilcar.com
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY /server/package*.json ./

RUN npm install

COPY /server/. .

EXPOSE 8080

CMD [ "node", "server.js" ]
