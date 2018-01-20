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
  echo -e "Runs previously created Docker's image."
	echo -e "Use case:"
	echo -e "  bash run.bash [-d|--dockerfile <arg>] [-n|--name <arg>]"
	echo -e "where"
	echo -e "  -d|--dockerfile - path to Dockerfile from which container's name and version will be read ('./Dockerfile' by default),"
  echo -e "  -n|--name - name of the container to be run (i.e. 'jenkins'),"
  echo -e "\ni.e.\n"
  echo -e "bash run.bash -d './Dockerfile'"
}

# Set parameter default values based on script's input if specified.
#
function checkParams() {
  # If variable is not defined
	if ! [ -n "${DOCKERFILE_PATH+x}" ]
  then
    DOCKERFILE_PATH="./Dockerfile"
  fi
}

# Checks if required parameters were set.
#
function checkReqParams() {
	[ -n "${CONTAINER_NAME+x}" ] && [ -n "${CONTAINER_PORT+x}" ] && [ -n "${CONTAINER_WORKING_DIR+x}" ]
}

# Displays yes/no prompt that returns 'y' or 'n' value.
#
# Parameters:
#	${1} - text to be displayed as prompt question.
#
function confirm() {
	if ifForce; then
		echo 'y'
	else
		read -e -p "${1} (y/n): "
		while [ "${REPLY}" != 'y' ] && [ "${REPLY}" != 'n' ]; do
			read -e -p "${1} (y/n): "
		done
		echo "${REPLY}"
	fi
}

# If -f flag is included.
#
function ifForce() {
    [ "${FORCE}" == 'y' ]
}

####################################################################################################################

# Reads given Dockerfile for parameters like container's name and version.
#
# Parameters:
# ${1} - path to Docker's configuration file for virtual machine creation
#
function parseDockerFile() {
  echo "Attempting to read configuration from Docker configuration file..."

  if [[ -f "${1}" ]]
  then
    echo "Configuration file for Docker's VM was found."
    
    if [ -n "${CONTAINER_NAME+x}" ]
    then
      echo "Image's name was defined by user so it won't be overwritten by configuration file."
    else
      CONTAINER_NAME="$(cat "${1}"  | grep "^FROM" | cut -d " " -f2 | cut -d ":" -f1)"
      echo "Image's name read from configuration file: ${CONTAINER_NAME}."
    fi
    
    if [ -n "${CONTAINER_PORT+x}" ]
    then
      echo "Image's port was defined by user so it won't be overwritten by configuration file."
    else
      CONTAINER_PORT="$(cat "${1}"  | grep "^EXPOSE" | cut -d " " -f2)"
      echo "Image's port read from configuration file: ${CONTAINER_PORT}."
    fi
    
    if [ -n "${CONTAINER_WORKING_DIR+x}" ]
    then
      echo "Image's working directory was defined by user so it won't be overwritten by configuration file."
    else
      CONTAINER_WORKING_DIR="$(cat "${1}"  | grep "^WORKDIR" | cut -d " " -f2)"
      echo "Image's version read from configuration file: ${CONTAINER_WORKING_DIR}."
    fi
    
    echo "Given values will be used:"
  else
    echo "No configuration for Docker's VM was found."
    echo -e "Default values will be used:"
  fi
  
  echo -e "\t- image's name: ${CONTAINER_NAME},"
  echo -e "\t- image's port: ${CONTAINER_PORT},"
  echo -e "\t- container's working directory: ${CONTAINER_WORKING_DIR}."     
}

# Starts given Docker's container.
#
# Parameters:
# ${1} - image's name to be associated with new container to be run, 
# ${2} - container's port to which it will be listening for incoming requests,
# ${3} - container's working directory to be mapped as to output directory of this project.
#
function startContainer {
  echo "Attempting to start a container with name '${1}' on port '${2}' with working directory set to '${3}'."
  
  local container_id="$(docker ps | grep "${1}:${2}" | sed 's/\s\+/ /g' | cut -d " " -f1)"
  
  if [ -n "${container_id}" ]
  then 
    echo "This container is already running. Stopping the container now..."
    docker stop "${container_id}" &> /dev/null
    echo "Stopped container will be removed..."
    docker rm "${container_id}" &> /dev/null
  fi
  
  echo "Running a container..."
  # In current version of Docker there is an issue with directory mapping 
  # between Windows host and Linux-based virtual machine. If we add this mapping,
  # we will encounter an error while creating symlinks inside docker
  # and therefor we will not be able to install some necessary dependencies for Jenkins.
  # -v "$(pwd)/jenkins_home":"${3}"
  docker run -p "${2}:${2}"  "${1}:${2}"
}
  
####################################################################################################################

#set -e

# Parse user's input (script parameters)
pasreBash "$@"
# Parse given script's parameters by given logic i.e. set default values for parameters if needed.
checkParams

# Try to read it's value from given Docker's configuration file.
parseDockerFile "${DOCKERFILE_PATH}"

if checkReqParams
then
  startContainer "${CONTAINER_NAME}" "${CONTAINER_PORT}" "${CONTAINER_WORKING_DIR}" 
else
  printHelp
fi