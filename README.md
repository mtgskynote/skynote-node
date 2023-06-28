This document contains steps for setting up the project and navigating around some common dependency issues.

1. There are two .env files one at the nodeJs(Backend) and another .env for the front-end(client-jb folder). (.env files contain credentials in key-value format for services used by the program they’re building. They’re meant to be stored locally and not be uploaded to code repositories online for everyone to read. Each developer in a team typically carries one or more .env files for each environment.) These .env files must be manually setup each time the github repository is newly setup. Further, this .env file is also ignored in the gitignore file so that it doesn't uploaded to the remote repository.

In order to execute the entire project there are setup processes that need to be done like installing the related npm modules required at both the front-end part and the back-end part which inturn results in creation of node_modules folder in the respective directory. package.json file under the "skynote-node" parent directory contains the npm commands to execute in the terminal such that the setup processes can be done before launching the application.

For example the package.json under 'skynote-node' directory consists of below snippet

    "scripts": {
        "install-dependencies": "npm run install-client && npm install",
        "setup-production": "npm run install-client && npm run build-client && npm install",
        "install-client": "cd client-jb && npm install",
        "build-client": "cd client-jb && npm run build",
        "server": "nodemon server",
        "client": "npm start --prefix client-jb",
        "start": "concurrently  --kill-others-on-fail  \"npm run server\" \"npm run client\" "
      }

Each of these 'keys' in the scripts json can be executed by running

    npm run <key> eg. npm run install-dependencies

if your encounter npm module version dependency issues while installing you can trying adding at the end of the line '--legacy-peer-deps' to the command. This will allow the installation of the package with a compatible version of the version dependant npm package.

    npm run install-dependencies --legacy-peer-deps

As a way to use legacy-peer-deps always you can configure it using the below line in terminal

    npm config set legacy-peer-deps true

3. OSMD Extended (Open sheet music display - Extended)

This project uses a paid version of the open sheet music display software and hence the usual version of the npm package for opensheetmusicdisplay will not fully support the functionalities implemented in this project. In order to use the opensheetmusicdisplay extended version you will need an access to the github repository of the osmd-extended.

How to build the OSMD-Extended minified build
**_ If you are starting from scratch or want an updated version of the osmd-extended _**
a) Clone the OSMD-Extended repository: https://github.com/opensheetmusicdisplay/osmd-extended in a separate directory

- The OSMD-Extended repository is not available to everyone, they give access only to sponsors (currently Abhishek, Lonce and Rafael have access to the extended repo)
  b) To build the minified version go to your clone directory run in your terminal:
  cd <cloned directory path>
  npm run build

You will find a minified opensheetmusicdisplay.min.js in the build/ folder. You can also run the local demo of osmd-extended with npm start

Detailed instructions to build can be found here: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/wiki/Build-Instructions.
\*the link is for Open source OSMD, however the steps to build for OSMD-Extended are same, instead of cloning the public OSMD, you clone the OSMD-Extended repo.

c) Once you have cloned the osmd-extended repo and built the minified version, add this in your dependencies in the package.json file.

“dependencies”: {
“opensheetmusicdisplay”: “file:opensheetmusicdisplay.min.js”,
}

Then replace the build folder in your Node modules OSMD folder.

**_ If you already have the build folder (folder with minified build) and want to use it in the Skynote project_**

if you are building the skynote webapp for production or want to use OSMD extended locally.

a) Get the the zipped version of 'build.zip' available in skynote google drive, and unzip it. (https://drive.google.com/drive/folders/19KW-vd0flJ-TkBLdoPlNgcyEafIthyyk)

b) npm i opensheetmusicdisplay
c) Replace the opensheetmusicdisplay dependency in package.json with:

"dependencies": {
"opensheetmusicdisplay": "file:opensheetmusicdisplay.min.js",
}
d) Finally, replace the 'build' folder in your node_modules/opensheetmusicdisplay folder with the build folder unzipped from previous step.
