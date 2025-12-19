# Pull Docker Hub base image
FROM node:24
# Install yarn
# RUN npm install --global yarn
# Set working directory
WORKDIR /usr/app
# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --check-files --network-concurrency 1
# Copy app to container
COPY . .
# Run the "start" script in package.json
CMD ["yarn", "run", "start"]
