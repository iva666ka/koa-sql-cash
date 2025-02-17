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
ENV sqlURL mysql://admin:admin@host.docker.internal:3306/library?connectionLimit=10
ENV elasticNode http://host.docker.internal:9200
ENV redisURL redis://host.docker.internal:6379/1

EXPOSE 3000
CMD [ "node", "index.js" ]
