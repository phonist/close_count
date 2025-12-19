# Pull Docker Hub base image
FROM node:24
# Install yarn
# RUN npm install --global yarn
# Set working directory
WORKDIR /usr/app
# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --check-files --network-concurrency 1
# RUN yarn global add -qy nodemon@2.0.6
# Copy app to container
COPY . .
# Run the "server" script in package.json
CMD ["yarn", "run", "server"]
