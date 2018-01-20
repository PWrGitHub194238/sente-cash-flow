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
  echo -e "Attach to previously run Docker's container."
	echo -e "Use case:"
	echo -e "  bash exec.bash [-d|--dockerfile <arg>] [-n|--name <arg>] [-p|--port <arg>]"
	echo -e "where"
	echo -e "  -d|--dockerfile - path to Dockerfile from which container's name and version will be read ('./Dockerfile' by default),"
  echo -e "  -n|--name - name of the container to be attached to (i.e. 'node'),"
  echo -e "  -p|--port - a port on which given container is running (i.e. 8081),"
  echo -e "\ni.e.\n"
  echo -e "bash exec.bash -d './Dockerfile'"
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
	[ -n "${CONTAINER_NAME+x}" ] && [ -n "${CONTAINER_PORT+x}" ]
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
    
    echo "Given values will be used:"
  else
    echo "No configuration for Docker's VM was found."
    echo -e "Default values will be used:"
  fi
  
  echo -e "\t- image's name: ${CONTAINER_NAME},"
  echo -e "\t- image's port: ${CONTAINER_PORT}."    
}

function attachToContainer {
  echo "Attempting to connect to container '${1}:${2}'..."
  
  local container_id="$(docker ps | grep "${1}:${2}" | sed 's/\s\+/ /g' | cut -d " " -f1)"
  
  if [ -n "${container_id}" ]
  then
    echo "Container with ID '${container_id}' was found. Attempting to attach..."
    # Run as root
    docker exec -it --user root "${container_id}" /bin/bash
  else
    echo "Cannot found any container with name '${1}' on port '${2}'."
  fi
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
  attachToContainer "${CONTAINER_NAME}" "${CONTAINER_PORT}"
else
  printHelp
fi