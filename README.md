<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/phonist/close_count">
    <img src="https://github.com/phonist/close_count/blob/master/client/public/favicon.png?raw=true" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Timer Application (Close Count)</h3>

  <p align="center">
    User can create multiple timers for their events.
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

![Timer](https://github.com/phonist/close_count/blob/master/client/public/assets/TimerPage.png?raw=true)

The project acts as a startup template for timer application.


This project only has one page and it is the timer page.
User can add and delete timer for their events.

### Built With
* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Node](https://nodejs.org/en/)


<!-- GETTING STARTED -->
## Getting Started
This project was developed under Docker environment. So please make sure Docker is installed.
To configure the docker environment. Please check docker-compose.yml and Dockerfile.
The project is using MERN stack.

After project setup is done, please open your browser, navigate to localhost:3000.
Register and login to the application to start creating your timers.


### Prerequisites
* Docker
* NodeJs
* React 
* MongoDB


### Installation
1. git clone https://github.com/phonist/close_count.git
2. cd close_count
3. docker-compose up -d --build
4. navigate to localhost:3000 and start your development

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement" or "bug".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/<featureName>`)
3. Commit your Changes (`git commit -m 'add <featurename>'`)
4. Push to the Branch (`git push origin feature/<featureName>`)
5. Open a Pull Request


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


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.




<!-- CONTACT -->
## Contact

Adrian Chong - [@twitter_handle](https://twitter.com/AdrianC50883820) - rujyi94@hotmail.com

Project Link: [https://github.com/phonist/close_count](https://github.com/phonist/close_count)
