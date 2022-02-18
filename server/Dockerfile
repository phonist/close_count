# Pull Docker Hub base image
FROM node:16-alpine3.14
# Install yarn
# RUN npm install --global yarn
# Set working directory
WORKDIR /usr/app
# Install app dependencies
COPY package*.json ./
RUN yarn install -qy
# RUN yarn global add -qy nodemon@2.0.6
# Copy app to container
COPY . .
# Run the "server" script in package.json
CMD ["yarn", "run", "server"]
