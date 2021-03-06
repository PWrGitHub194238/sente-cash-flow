#!\bin\bash

function pasreBash() {
	while (( ${#} > 0 ))
	do
		case "${1}" in
			-d|--dockerfile)
				DOCKERFILE_PATH="${2}"
        shift
			;; 
			-n|--name)
				CONTAINER_NAME="${2}"
        shift
			;;  
			-e|--environment)
				DOCKER_ENV="${2}"
        shift
			;;     
			-w|--worked-dir)
				CONTAINER_WORK_DIR="${2}"
        shift
			;; 
			-p|--port)
				CONTAINER_PORT="${2}"
        shift
			;;    
			--ver)
				CODE_VERSION="${2}"
        shift
			;;
			*)
				printHelp
				exit
			;;
		esac
		shift # next argument
	done
}

# Public function
#
# Print help for script
#
function printHelp() {
  echo -e "Build docker's image for this node.js's project to be run at given port."
	echo -e "Use case:"
	echo -e "  bash build.bash [-d|--dockerfile <arg>] [-n|--name <arg>] [-e|--environment <arg>] [-w|--worked-dir <arg>] [-p|--port <arg>] [--ver <arg>]"
	echo -e "where"
  echo -e "  -d|--dockerfile - path to Dockerfile that will be generated by this script ('./Dockerfile' by default),"
  echo -e "  -n|--name - name of the new image to be build (i.e. 'node'),"
  echo -e "  -e|--environment - environment for which a new image will be build ('dev' by default),"
	echo -e "  -w|--worked-dir - a directory path where this project's files will be stored inside a container that will be created ('/usr/nodejs/' by default),"
	echo -e "  -p|--port - a port on which node.js server that will be run inside docker's container will be listening ('8081' by default),"
	echo -e "  --ver - version of 'node' container to be build ('latest' by default),"
  echo -e "\ni.e.\n"
  echo -e "bash build.bash -d './Dockerfile'"
  echo -e "bash build.bash -d './Dockerfile' -n 'node' -e 'dev' -w '/usr/nodejs/' -p '8081' --ver 'latest'"
}

# Set parameter default values based on script's input if specified.
#
function checkParams() {
  # If variable is not defined
	if ! [ -n "${CONTAINER_NAME+x}" ]
  then
    CONTAINER_NAME="node"
  fi
  
	if ! [ -n "${DOCKERFILE_PATH+x}" ]
  then
    DOCKERFILE_PATH="./Dockerfile"
  fi
  
  if ! [ -n "${DOCKER_ENV+x}" ]
  then
    DOCKER_ENV="dev"
  fi
  
	if ! [ -n "${CONTAINER_WORK_DIR+x}" ]
  then
    CONTAINER_WORK_DIR="/usr/nodejs/"
  fi
  
	if ! [ -n "${CONTAINER_PORT+x}" ]
  then
    CONTAINER_PORT="8081"
  fi
  
	if ! [ -n "${CODE_VERSION+x}" ]
  then
    CODE_VERSION="latest"
  fi
}

# Checks if required parameters were set.
#
function checkReqParams() {
	[ -n "${DOCKERFILE_PATH+x}" ] &&[ -n "${CODE_VERSION+x}" ] &&[ -n "${CONTAINER_NAME+x}" ] && [ -n "${CONTAINER_WORK_DIR+x}" ] && [ -n "${DOCKER_ENV+x}" ] && [ -n "${CONTAINER_PORT+x}" ] 
}

####################################################################################################################

# Generate Docker's configuration file for a new Docker's image to be build.
#
# Parameters:
# ${1} - path to Docker's configuration file for virtual machine creation,
# ${2} - version of Docker's base image to be downloaded,
# ${3} - name of Docker's base image to be downloaded,
# ${4} - path of working directory that will be used on virtual machine that configuration describes,
# ${5} - configuration mode: "prod" or "dev".
# ${6} - port on which virtual machiner that will be created will listen for request from host.
#
function createDocker() {

  echo "Removing Docker related files..."
  
  [ -e "${1}" ] && rm "${1}"
  
  echo "Creating Docker file with instructions to build virtual machine's image..."
 
  touch "${1}"

  # Set version of Docker's image to be downloaded.
  echo "ARG VERSION=${2}" >> "${1}"
  # Build Docker's image base on predefined image of given version.
  echo "FROM ${3}:\${VERSION}" >> "${1}"
  # Create working directory for application and change directory to it.
  echo "WORKDIR ${4}" >> "${1}"
  # Copy configuration files that allowed npm to install all dependencies
  # into working directory - relative to WORKDIR.
  echo 'COPY package*.json ./' >> "${1}"
  
  if [[ "${5}" == "prod" ]]
  then
    # Install all dependencies for production environment
    echo 'RUN npm install --only=production' >> "${1}"
  else
    # or all dependencies listed in package.json file as 'dependencies' and 'devDependencies'
    echo 'RUN npm install' >> "${1}"
  fi
  
  # Copy all output project's file into container's directory.
  # That directory should be mapped along with docker virtual machine's start.
  echo 'COPY ./dist/ ./dist/' >> "${1}"
  # Add listener for given port. It allows user to communicate with Docker's VM on this port.
  echo "EXPOSE ${6}" >> "${1}"
  # Add command to run npm's start script within package.json file.
  echo 'CMD [ "npm", "start" ]' >> "${1}"
}
  
# Creates a file that contains a list of files/directories to be ignored while coping files based on Dockerfile's instructions.
function createDockerIgnore() {

  echo "Removing Docker related files..."
  
  [ -e '.dockerignore' ] && rm '.dockerignore'
  
  echo "Creating Docker's ignore file..."
 
  touch '.dockerignore'

  # Creates a list of files/directories to be ignored while coping files based on Dockerfile's instructions.
  echo 'node_modules' >> '.dockerignore'
  echo 'npm-debug.log' >> '.dockerignore'  
}

####################################################################################################################

#set -e

# Parse user's input (script parameters)
pasreBash "$@"
# Parse given script's parameters by given logic i.e. set default values for parameters if needed.
checkParams

if checkReqParams
then
  # Install all dependencies listed in package.json file as 'dependencies' and 'devDependencies'
  npm install

  if (( $? == 0 ))
  then
    # Create Docker's configuration file that will be used to build a new Docker's image.
    createDocker "${DOCKERFILE_PATH}" "${CODE_VERSION}" "${CONTAINER_NAME}" "${CONTAINER_WORK_DIR}" "${DOCKER_ENV}" "${CONTAINER_PORT}"
    createDockerIgnore
    
    echo "Building a new image..."
    
    # Build a new image based on given Dockerfile with given name.
    docker build --no-cache --force-rm --file "${DOCKERFILE_PATH}" -t "${CONTAINER_NAME}:${CONTAINER_PORT}" .
    
    echo "A new image has ben created and added to Docker image's list:"
    docker images
  else
    echo "There was an error during install npm dependencies"
  fi
else
  printHelp
fi