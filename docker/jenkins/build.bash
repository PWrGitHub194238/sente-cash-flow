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
  echo -e "Build docker's image for this Jenkins' project to be run at given port."
	echo -e "Use case:"
	echo -e "  bash build.bash [-d|--dockerfile <arg>] [-n|--name <arg>] [-w|--worked-dir <arg>] [-p|--port <arg>] [--ver <arg>]"
	echo -e "where"
  echo -e "  -d|--dockerfile - path to Dockerfile that will be generated by this script ('./Dockerfile' by default),"
  echo -e "  -n|--name - name of the new image to be build (i.e. 'jenkins'),"
	echo -e "  -w|--worked-dir - a directory path where this project's files will be stored inside a container that will be created ('/var/jenkins_home/' by default),"
	echo -e "  -p|--port - a port on which node.js server that will be run inside docker's container will be listening ('8080' by default),"
	echo -e "  --ver - version of 'node' container to be build ('latest' by default),"
  echo -e "\ni.e.\n"
  echo -e "bash build.bash -d './Dockerfile'"
  echo -e "bash build.bash -d './Dockerfile' -e 'dev' -w '/var/jenkins_home/' -p '8080' --ver 'latest'"
}

# Set parameter default values based on script's input if specified.
#
function checkParams() {
  # If variable is not defined
	if ! [ -n "${CONTAINER_NAME+x}" ]
  then
    CONTAINER_NAME="jenkins"
  fi
  
	if ! [ -n "${DOCKERFILE_PATH+x}" ]
  then
    DOCKERFILE_PATH="./Dockerfile"
  fi
  
	if ! [ -n "${CONTAINER_WORK_DIR+x}" ]
  then
    CONTAINER_WORK_DIR="/var/jenkins_home/"
  fi
  
	if ! [ -n "${CONTAINER_PORT+x}" ]
  then
    CONTAINER_PORT="8080"
  fi
  
	if ! [ -n "${CODE_VERSION+x}" ]
  then
    CODE_VERSION="latest"
  fi
}

# Checks if required parameters were set.
#
function checkReqParams() {
	[ -n "${DOCKERFILE_PATH+x}" ] && [ -n "${CODE_VERSION+x}" ] &&[ -n "${CONTAINER_NAME+x}" ] &&[ -n "${CONTAINER_WORK_DIR+x}" ] && [ -n "${CONTAINER_PORT+x}" ]
}

####################################################################################################################

# Generate Docker's configuration file for a new Docker's image to be build.
#
# Parameters:
# ${1} - path to Docker's configuration file for virtual machine creation,
# ${2} - version of Docker's base image to be downloaded,
# ${3} - name of Docker's base image to be downloaded,
# ${4} - path of working directory that will be used on virtual machine that configuration describes,
# ${5} - port on which virtual machiner that will be created will listen for request from host.
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
  
  # Add listener for given port. It allows user to communicate with Docker's VM on this port.
  echo "EXPOSE ${5}" >> "${1}"
}
 

####################################################################################################################

#set -e

# Parse user's input (script parameters)
pasreBash "$@"
# Parse given script's parameters by given logic i.e. set default values for parameters if needed.
checkParams

if checkReqParams
then
  # Create Docker's configuration file that will be used to build a new Docker's image.
  createDocker "${DOCKERFILE_PATH}" "${CODE_VERSION}" "${CONTAINER_NAME}" "${CONTAINER_WORK_DIR}" "${CONTAINER_PORT}"
  
  echo "Building a new image..."
  
  # Build a new image based on given Dockerfile with given name.
  docker build --no-cache --force-rm --file "${DOCKERFILE_PATH}" -t "${CONTAINER_NAME}:${CONTAINER_PORT}" .
  
  echo "A new image has ben created and added to Docker image's list:"
  docker images
else
  printHelp
fi