#!\bin\bash

npm install

touch "Dockerfile"

echo 'FROM node:carbon

# Create app directory
WORKDIR /usr/nodejs

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ./dist/ ./dist/

EXPOSE 8081
CMD [ "npm", "start" ]' > 'Dockerfile'

echo 'node_modules
npm-debug.log' > '.dockerignore'

docker build --no-cache --force-rm -t node:carbon .