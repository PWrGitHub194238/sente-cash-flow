
# **sente-cash-flow**

> Because money management is difficult, especially when that money is not Yours, especially when it comes to food.

This is a [Apps Script](https://developers.google.com/apps-script/) based project which main goal is to make food ordering management (who owns who and how many) easy, intuitive and - most of all - automatic. Production version of this project can be found [here](https://docs.google.com/spreadsheets/d/1tSpgcZ7IIzNIgpbXIwWVoeewzInpUmFRGLOrAlJszP4/edit?usp=sharing). It heavely uses [Google's Spreadsheet Service](https://developers.google.com/apps-script/reference/spreadsheet/) so it is quite problematic to move entire project aside of [Google Docs' Sheet](https://www.google.com/intl/pl/sheets/about/). This is not a big project to be honest, it mostly serves as technological preview in which most of modern technologies may be used with ease: [TypeScript](https://github.com/Microsoft/TypeScript) with [mochajs](http://mochajs.org/) serves as a unit testing framework. [Nightwatch.js](http://nightwatchjs.org/) as a end-to-end, [Selenium](http://www.seleniumhq.org/)-based testing framework, [HTML5](https://www.w3schools.com/html/html5_intro.asp), [CSS3](https://www.w3.org/Style/CSS/Overview.en.html) with [CSS Grid Layout](https://css-tricks.com/snippets/css/complete-guide-grid/), [Jenkins](https://jenkins-ci.org/) with [Blue Ocean](https://jenkins.io/projects/blueocean/) as a CI server, [node.js](https://nodejs.org/en/) as a web server, a lot of good programming practice that require discipline to obey them and where that obedience is not so simple any more in larger project.

### **Project's structure**

To begin with, I'm going to talk about basic structure of entire project. Down below we can see a list of directories and some short comment on every of it.

```
sente-cash-flow
├── client # project's development files
│   ├── ...
│   ...
├── docker # images for Jenkins' and node.js's VM
│   ├── ...
│   ...
├── server # files that are deployed on Google Docs' Sheet
│   ├── ...
│   ...
├── .gitignore # Git repository ignore file
├── LICENSE # licence
└── README.md # content of this file
```

As you can see, entire project is contained by <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**client** directory as it holds all files that are used on Google's server side. Be mindful that files in this directory are not same as files in <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**server** - there are some functionalities that simply cannot be used on local host that are used on Google's server side and vice versa; for example data on server's side is loaded directly from spreadsheet (see [Main.gs](https://github.com/PWrGitHub194238/sente-cash-flow/blob/master/server/scripts/Main.gs) Google's script) while on local host same data are delivered by other script file (see [mock.ts](https://github.com/PWrGitHub194238/sente-cash-flow/tree/master/client/scripts) TypeScript file). On server's side also there is no simple way to reference script/style sheet files by simply putting:

```html
<link rel="stylesheet" type="text/css" href="...">
<script src="..."></script>
```
lines in HTML's **head** section (because all HTML files that are used by spreadsheet are stored on server's side and there is no way to store those **\*.js**/**\*.css** files there as well, to make relative paths working). Instead every file, that on local side is included in that way, have to be passed directly into HTML file where it is used.

To make long story short:

 - <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**client** directory holds project files that works on local machines,
 - <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**server** holds the same files but augmented/modified in a way that they are working on Google server side.

### **Installing / Getting started**

To begin with we have to talk about [Docker](https://www.docker.com/what-docker) as we will use it to run our web ([node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)) and continuous integration ([Jenkins](https://hub.docker.com/r/jenkins/jenkins/)) server on virtual machines.

We will be using [Docker Toolbox for Windows](https://docs.docker.com/toolbox/toolbox_install_windows/). After successful installation of this tool, we should see console logs like those:

```bash


                        ##         .
                  ## ## ##        ==
               ## ## ## ## ##    ===
           /"""""""""""""""""\___/ ===
      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~
           \______ o           __/
             \    \         __/
              \____\_______/

docker is configured to use the default machine with IP 192.168.99.100
For help getting started, check out the docs at https://docs.docker.com

Start interactive shell

strza@Windows10Pro MINGW64 ~
$
```

After prompt showed up, we need to start our Virtual Machines: one for web server and the other for Jenkins. To do this, we can use predefined set of bash scripts with default values, like so:

```bash
strza@Windows10Pro MINGW64 ~/
$ cd ./docker/jenkins/

strza@Windows10Pro MINGW64 ~/Desktop/docker/jenkins
$ bash build.bash

strza@Windows10Pro MINGW64 ~/docker/jenkins
$ bash run.bash
```

or we can use any of those scripts' parameters to customize process. It is important to notice that <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_description_black_24px.svg" width="12">**run.bash** script will not only get a container running (which we previously build by running <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_description_black_24px.svg" width="12">**build.bash** script) but leaves us logged into virtual machine that it starts, so in order to create and run our node.js web server, we have to start another interactive shell:

```bash
strza@Windows10Pro MINGW64 ~/
$ cd ./docker/node.js/

strza@Windows10Pro MINGW64 ~/docker/node.js
$ bash build.bash -d './Dockerfile' -n 'node' -e 'dev' -w '/usr/nodejs/' -p '8081' --ver 'latest'
up to date in 2.513s
Removing Docker related files...
Creating Docker file with instructions to build virtual machine's image...
Removing Docker related files...
Creating Docker's ignore file...
Building a new image...
Sending build context to Docker daemon  184.8kB
Step 1/8 : ARG VERSION=latest
...

strza@Windows10Pro MINGW64 ~/docker/node.js
$ bash run.bash -d './Dockerfile'
Attempting to read configuration from Docker configuration file...
Configuration file for Docker's VM was found.
Image's name read from configuration file: node.
Image's port read from configuration file: 8081.
Image's version read from configuration file: /usr/nodejs/.
Given values will be used:
        - image's name: node,
        - image's port: 8081,
        - container's working directory: /usr/nodejs/.
Compiling TypeScript files for '~/docker/node.js'...
Compiling TypeScript files for '~/client'...
Copying compiled files into output directory of the node;js server.
Attempting to start a container with name 'node' on port '8081' 
  with working directory set to '/usr/nodejs/'.
Running a container...

> docker_web_app@1.0.0 start /usr/nodejs
> supervisor ./dist/index.js


Running node-supervisor with
  program './dist/index.js'
  --watch '.'
  --extensions 'node,js'
  --exec 'node'

Starting child process with 'node ./dist/index.js'
Watching directory '/usr/nodejs' for changes.
Press rs for restarting the process.
Running on http://0.0.0.0:8081
```

This set of commands tell scripts explicity to:

 - create a Docker container's configuration file, named **Dockerfile**, that describes how our virtual machine will be build,
 - by this file it will instruct Docker to firstly download a **lastest** (**--ver**) version of base image of **node** (**-n**),
 - set it installation directory to **/usr/nodejs/** (**-w**),
 - and let the container be openned for incoming request on port **8081** (**-p**).

Next <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_description_black_24px.svg" width="12"> **run.bash**, based on a given configuration file, will run node.js web server on given port. Before that it will also compiles any TypeScript files both in <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**./docker/node.js/** and <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**./client/** directory and place output into <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**./docker/node.js/dist/**. The last directory will be mapped into container's directory (<img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**/usr/nodejs/dist/** by default) thus every change in this directory will be also visible in container and vice versa. Our web server was run by supervisor, in watch mode, so any change in that directory on our (host) side will not only be visible on virtual machine but it will also triggers our server to restart.

To manually restart either container running node.js or Jenkins all we need to do is run:

```bash
strza@Windows10Pro MINGW64 ~/docker/node.js
$ bash run.bash
```

and to stop either of these containers and clean entire solution (remove container, Docker's images, project's output) we can execute:

```bash
strza@Windows10Pro MINGW64 ~/docker/node.js
$ bash clear.bash
```

### **Testing client-side project**

To be able to test this project, we are using two separated testing frameworks:

 - [mochajs](http://mochajs.org/) is design for unit testing JavaScript code (executed by [ts-node](https://github.com/TypeStrong/ts-node) to make TypeScript code readable for testing framework),
 - [Nightwatch.js](http://nightwatchjs.org/) that handles end-to-end testing, allowing us to validate entire project on a real browser in automatic way

Here is detailed structure for the <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**client**  directory, where our tests are stored:

```
client
├── .vscode # Visual Studio Code files
│   ├── launch.json
│   └── tasks.json
├── node_modules # node.js dependencies
│   ├── ...
│   ...
├── src # client-side project's sources
│   ├── ...
│   ...
├── test # end-to-end test files
│   ├── ...
│   ...
├── nightwatch.conf.js # Nightwatch.js configuration file
├── package.json # npm configuration file
└── tsconfig.json # TypeScript project's configuration file
```

#### Running [mochajs](http://mochajs.org/) test by example

...

#### Running [Nightwatch.js](http://nightwatchjs.org/) test by example

To run any Nightwatch test, we have to set up our node.js web sever first:

```bash
strza@Windows10Pro MINGW64 ~/client
$ cd ../docker/node.js/

strza@Windows10Pro MINGW64 ~/docker/node.js
$ bash run.bash
Attempting to read configuration from Docker configuration file...
Configuration file for Docker's VM was found.
...
Running on http://0.0.0.0:8081
```
Now we can visit our site (in this example http://192.168.99.100:8081/) and see it is up and running and ready to be tested.

As we noticed earlier, <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_description_black_24px.svg" width="12">**package.json** configuration file contains several aliases that make executing some given task more easily i.e running both unit or functional tests. By entering main directory for our client-side project and executing [npm](https://docs.npmjs.com/getting-started/what-is-npm) script:

```bash
strza@Windows10Pro MINGW64 ~/client
$ npm run e2e
```

we actually run:

```bash
strza@Windows10Pro MINGW64 ~/client
$ tsc -p . && nightwatch --config nightwatch.conf.js || true
```

which is going to start a Selenium server, on which our tests will be executed, giving example output:

```bash
Running:  Step 1
 √ Element <body> was visible after 914 milliseconds.
 √ Expected element <body> to be present in 1000ms - element was present in 255ms
 √ Element <#who-order-checkbox-id> was visible after 553 milliseconds.
 √ Expected element <#who-order-checkbox-id> to be visible - condition was met in 399ms

OK. 4 assertions passed. (46.968s)
```

Scope of our tests is defined by <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_description_black_24px.svg" width="12">**nightwatch.conf.js** configuration file, <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**./test/e2e/** by default. By running above npm command we firstly compiles all TypeScript files in given folder and after successful compilation nightwatch starts our tests. Their results will be saved into <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**./test/reports/** directory (by default) and every optional screenshoots that we decide to make during tests' execution will be saved into <img src="https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_folder_black_24px.svg" width="12">**./test/screenshots/**.