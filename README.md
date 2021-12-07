### Close Count

Count down application with user authorization.

### Made with Mern Stack

mongodb: 4.4.5
express: 4.17.1
react: 17.0.1
node : 16.2.0

[Close Count GitHub](https://github.com/phonist/close_count)
Close Count is an example project in which end users can create multiple timers for their events.

There are two major folders: server and client.

As stated in the title, the project is built on top of MERN.

Install dependencies for each server and client side package by package.json


### Yaml File
When changes are pushed to the master branch, the actions will be triggered. In fact, the master branch serves as the production deployment.

```
name: Production script

on:
  push:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-20.04

    steps:
      - uses: actions/checkout@v2
      - name: Install Nodejs and NPM
        run: |
          curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
          sudo apt install nodejs
      - name: Install nodejs, npm and yarn
        run: |
          curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg
          sudo apt-key add -echo "deb https://dl.yarnpkg.com/debian/ stable main" 
          sudo tee /etc/apt/sources.list.d/yarn.list
          sudo apt update && sudo apt install yarn
          echo nodejs version
          node -v
          echo npm version
          npm -v
          echo yarn version
          yarn -v
  server:
    needs: build
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - name: Install server dependencies
        working-directory: ./server
        run: |
          yarn install
  client:
    needs: build
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - name: Install client dependencies
        working-directory: ./client
        run: |
          yarn install     

```

Ubuntu-20.04 was chosen as the operating system for the workflow.
First, install the YARN package manager.
After that, run yarn install in both the server and client folders to install all required dependencies.
