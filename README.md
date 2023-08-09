This document contains steps for setting up the project and navigating around some common dependency issues.

appskynote.com (143.110.164.154, hosted on DigitalOcean, must have an account with ssh access (ask lonce)

**MongoDB**

​ If you use Compass of Studio3T GUIs to access, your credentials should look like this:

- General/Host - localhost:27017
- Username/Password - your database usename and password and the database your credentials are associated with. Authentification Mechansm: SCRAM-SHA-256
- Proxy/SSH - SSH Hostname: appskynote.com, SSH Port: 22, SSH Username: login name for appskynote.com, SSH Identity File: browse to your private key file (e.g. ~.ssh/id_rsa)

---

**Code Base** (stored on GitHub)

1. There are two .env files one at the nodeJs(Backend) and another .env for the front-end(client-jb folder). (.env files contain credentials in key-value format for services used by the program they’re building. They’re meant to be stored locally and not be uploaded to code repositories online for everyone to read. Each developer in a team typically carries one or more .env files for each environment.) These .env files must be manually setup each time the github repository is newly setup. Further, this .env file is also ignored in the gitignore file so that it doesn't get uploaded to the remote repository.

In order to execute the entire project there are setup processes that need to be done like installing the related npm modules required at both the front-end part and the back-end part which in turn results in creation of node_modules folder in the respective directory. package.json file under the "skynote-node" parent directory contains the npm commands to execute in the terminal such that the setup processes can be done before launching the application.

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

if your encounter npm module version dependency issues while installing you can trying adding at the end of the line '--legacy-peer-deps' to the command. This will allow the installation of the package with a compatible version of the version dependent npm package.

    npm run install-dependencies --legacy-peer-deps

As a way to use legacy-peer-deps always you can configure it using the below line in terminal

    npm config set legacy-peer-deps true

3. OSMD Extended (Open sheet music display - Extended)

[Opensheetmusicdisplay(OSMD)](https://opensheetmusicdisplay.org/) is the library based on vexflow that is used to render sheet music (music scores). The standard for displaying and sharing sheet music display is using MusicXML files, and OSMD can render these files along with xml files. The free version of OSMD that can be installed using "npm i opensheetmusicdisplay" which is limited to displaying the scores, and doing some basic interaction with it, like showing a cursor, zoom in out, show score names etc. However, the need of this project is beyond that as we also need to playback the music scores. To do that an audio player is needed, which is included in the paid version.

Therefore, this project uses a paid version of the OSMD software and hence the usual version of the npm package for opensheetmusicdisplay will not fully support the functionalities implemented in this project. In order to use the opensheetmusicdisplay extended version you will need access to the github repository of the osmd-extended. The [osmd-extended](https://github.com/opensheetmusicdisplay/osmd-extended) repository is not available to everyone, they give access only to sponsors (currently Abhishek, Lonce and Rafael have access to the extended repo).

Once you get access to the extended repo, you need to build it locally to get the additional features such as audioplayer and playback manager which we need to run the appskynote.com. The build gives you this file: opensheetmusicdisplay.min.js. There can be two cases in which you will need to build the OSMD-extended. Either when you are starting from scratch, or OSMD has released a new version with updated features. The steps to build the minified file in these cases is given below.

NOTE THAT: You dont need to always build osmd-extended from scratch, since we only need the opensheetmusicdisplay.min.js file, we have built it and stored it in Google drive folder. To use that prebuild file please follow the steps given after the scratch buid process.

**_ If you are starting from scratch or want an updated version of the osmd-extended _**

a) Clone the OSMD-Extended repository: https://github.com/opensheetmusicdisplay/osmd-extended in a separate directory

b) To build the minified version go to your clone directory and run in your terminal:
cd "cloned directory path"
npm run build

You will find a minified opensheetmusicdisplay.min.js in the build/ folder. If you want to test the official version of osmd-extended provided by the developers of OSMD, you can also run the local demo of osmd-extended by using the command: npm start

If you need more detailed instructions to build, they can be found here: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/wiki/Build-Instructions.
\*the link is for Open source OSMD, however the steps to build for OSMD-Extended are same, instead of cloning the public OSMD, you clone the OSMD-Extended repo.

d) Once you have cloned the osmd-extended repo and built the minified version,

i) first do: npm i opensheetmusicdisplay

ii) then go to your skynote-node/client-jb folder and in your package.json file under dependencies and:

        replace:

        "dependencies": {
            "opensheetmusicdisplay": "opensheetmusicdisplay": "^0.6.8",
        }

        with:

        “dependencies”: {
            "opensheetmusicdisplay”: “file:opensheetmusicdisplay.min.js",
        }

e) Then go to the "build/" folder you got after building the osmd-extended, copy it and paste it in your Node modules folder under the skynote-node/client-jb/node-modules/opensheetmusicdisplay/.

**_ If you already have the opensheetmusicdisplay folder (folder with minified build) and want to use it in the Skynote project_**

a) Get the the zipped version of 'opensheetmusicdisplay.zip' available in skynote google drive, and unzip it. (https://drive.google.com/drive/folders/19KW-vd0flJ-TkBLdoPlNgcyEafIthyyk)

b) Replace the opensheetmusicdisplay dependency in package.json with:

        "dependencies": {
            "opensheetmusicdisplay": "^0.6.8",
        }

        with:

        “dependencies”: {
            "opensheetmusicdisplay”: “file:opensheetmusicdisplay.min.js",
        }

c) Then go to the "build/" folder you got after unzipping, copy it and paste it in your Node modules folder under the skynote-node/client-jb/node-modules/opensheetmusicdisplay/.

++++++++++++++++++

4. To run "in development:

   a. Put your .env file into the main appskynote directory

5. ** Production deployment steps**
   1. Once all packages are installed in your production server folder, To copy the opensheetmusicdisplay related contents to client-jb/node_modules
   2. Create a .env file and set the necessary values inside of it.
   3. To start process using 'pm2'
      - run 'pm2 start server.js' (https://pm2.keymetrics.io/docs/usage/process-management/)
        a. Put your .env file into the main appskynote directory

### How OSMD works:

Before explaining how OSMD works and how it is setup in the context of this app, Here are some useful links that will help in exploring the functionalities of OSMD.

Basic links:

- OSMD website: https://opensheetmusicdisplay.org/
- OSMD Github: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay
- OSMD Extended Github: https://github.com/opensheetmusicdisplay/osmd-extended
- OSMD Public Demo: https://opensheetmusicdisplay.github.io/demo/
- OSMD Extended Public Demo: https://opensheetmusicdisplay.org/demos/sponsors-ts-demo/

* OSMD Exploring the demo: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/wiki/Exploring-the-Demo

The wiki and class documentation of the opensheetmusicdisplay:

- OSMD WIKI: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/wiki
- OSMD Class Documentation: https://opensheetmusicdisplay.github.io/classdoc/

The class documentation has extensive information about the specifics of setting up osmd, like its constructor, options, different methods etc.

Additionally, to understand the basics of OSMD-Extended, the developers have provided an informational issue (62) that gives information about how OSMD extended works and the link to the same is: https://github.com/opensheetmusicdisplay/osmd-extended/issues/62

##### Setup process

In this project the OSMD as said before is used to render scores. The basic process of setting up OSMD is:

1. First make the constructor
2. Define the options
3. Create a new instance of the osmd constructor
4. load the file in the osmd instance and render it.
   This process is discussed in detail in the next sections.

We are rendering the scores in two places in the project as of now. One is to preview the scores in the all-lessons page (OpenSheetMusicDisplayPreview.js). The second place is to actually render the whole score according to whichever score is selected (OpenSheetMusicDisplay.js).

The next section defines how the OSMD is setup for both these scenarios.

#### OSMDPreview (OpenSheetMusicDisplayPreview.js)

This is a very basic setup of OSMD. The basic idea of using and settip us OSMD is that

The OpenSheetMusicDisplayPreview component is designed to display a preview of musical scores using the OpenSheetMusicDisplay library. This component is separate from the main OSMD component, which is used to display the full score with features like a cursor, audioplayer etc. The purpose of this separation is to allow for reusability and to avoid potential conflicts.

_Setup_

The OpenSheetMusicDisplayPreview component accepts a file prop, which should be the musicXML file you wish to display.

_Inside the component:_

- A reference (osmdRef) is created to hold the OSMD instance.
- The useEffect hook initializes the OSMD instance with specific options and loads the musicXML file. It then renders the first 4 bars of the score and hides the cursor.

_OSMD Options_

The options for the OSMD instance are basically the particulars you want your OSMD render to follow, they are defined in this component for this reasons:

- The display auto-resizes: autoResize: true,
- The title of the score is not drawn: drawTitle: false,
- The display parameters are set to "compacttight": drawingParameters: "compacttight",
- Only the first 4 bars (measures) of the score are displayed: drawFromMeasureNumber: 0, drawUpToMeasureNumber: 4,

_Rendering_

The component renders a div with the id osmd-container. This is where the OSMD instance will render the score preview.

_Usage_

To use the OpenSheetMusicDisplayPreview component at other places in the application:

        import OpenSheetMusicDisplayPreview from './path-to-component';

        <OpenSheetMusicDisplayPreview file={yourMusicXMLFile} />

#### Main OSMD (OpenSheetMusicDisplay.js)

This is the component that actually displays the full music xml scores. The overall outline of this component is the same as it was in the OpenSheetMusicDisplayPreview component. That is you create a construtor, define options, create instance, load the file in it and render the instance.

However, Since along with displaying the score we are also creating additional interactions with the score, this particular component is bit more complex in comparison to the preview file. Some of the additional interactions are cursor display, audio playback, pitch detection and comparison etc.

This component's options and other properties such as cursor position, audio playback etc are setup to be controlled from other components wherever the OpenSheetMusicDisplay is imported, by sending values and controls as props to OpenSheetMusicDisplay. In this project its done by importing the OpenSheetMusicDisplay in the ProgressPlayFile.js component.

The ProgressPlayFile.js component is the component which is called when we click on the score in all-lessons page(the routes are defined in the app.js file). Therefore it is the ProgressPlayFile component that sends data to osmd to load the music score. In ProgressPlayFile, the control bar is also defined, and the action to be taken when a button is clicked on the control bar is linked with what happens in the osmd component. For example, when the play button is clicked, a prop is sent from ProgressPlayFile to OpenSheetMusicDisplay component and in the OpenSheetMusicDisplay component, playback is set to play.

Similarly, for creating the linechart, the initial position of cursor is calculated in the OpenSheetMusicDisplay.js component and then is sent to LinechartOsmd.js component. Therefore, OpenSheetMusicDisplay.js plays a central role in the rendering and interaction with the score and sheets.

Additionally, there are some functions like metronome volume, bpm etc that are already implemented but commented out in the code. They can be used again by adjusting the code according to the current version. For example, the slider for adjusting bpm is already implemented (in ProgressPlayFile) but the code is commented out. So it can be uncommented and implemented again.

The related code and specific details can be found in the respective .js files.

One additional thing, Osmd developer are very active on the Discord channel, so if you need any help they can be contacted on the same are generally very responsive.
