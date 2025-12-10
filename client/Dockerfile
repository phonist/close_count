# Pull Docker Hub base image
FROM node:24
# Install yarn
# RUN npm install --global yarn
# Set working directory
WORKDIR /usr/app
# Install app dependencies
COPY package*.json ./

RUN yarn config set networkTimeout 600000 \
 && yarn config set registry "https://registry.npmjs.org/" \
 && yarn install -qy --network-timeout 600000
# Copy app to container
COPY . .
# Run the "start" script in package.json
CMD ["yarn", "run", "start"]
