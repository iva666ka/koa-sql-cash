FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# host.docker.internal reffered on docker host
ENV sqlHost host.docker.internal
ENV elasticNode http://host.docker.internal:9200
ENV redisHost host.docker.internal

EXPOSE 3000
CMD [ "node", "index.js" ]
