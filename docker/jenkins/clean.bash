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
			-p|--port)
				CONTAINER_PORT="${2}"
        shift
			;;    
			--ver)
				CODE_VERSION="${2}"
        shift
			;;
			-f|--force)
				FORCE='y'
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
  echo -e "Cleans entire Jenkins project"
	echo -e "Use case:"
	echo -e "  bash clean.bash [-d|--dockerfile <arg>] [-n|--name <arg>] [-p|--port <arg>] [--ver <arg>] [-f|--force]"
	echo -e "where"
	echo -e "  -d|--dockerfile - path to Dockerfile from which container's name and version will be read ('./Dockerfile' by default),"
  echo -e "  -n|--name - name of the container to be deleted (i.e. 'jenkins'),"
  echo -e "  -p|--port - a port on which Jenkins service that will be run inside docker's container is listening (i.e. 8080),"
	echo -e "  --ver - version of 'jenkins' container to be removed (i.e. 'latest'),"
  echo -e "  -f|--force - ignores any error occurred in any stage of this script,"
  echo -e "\ni.e.\n"
  echo -e "bash clean.bash -d './Dockerfile' -f"
  echo -e "bash clean.bash -p 8080 --ver 'latest' -f"
}

# If -f flag is included.
#
function ifForce() {
    [ "${FORCE}" == 'y' ]
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
	[ -n "${CONTAINER_NAME+x}" ] && [ -n "${CONTAINER_PORT+x}" ] && [ -n "${CODE_VERSION+x}" ]
}

####################################################################################################################

# Closes and removes given Docker's container with given version.
#
# Parameters:
# ${1} - Docker container's name to be removed,
# ${2} - port of given container's name to be removed.
#
function closeContainer() {
  echo "Attempting to stop container '${1}:${2}'..."
  
  local container_id="$(docker ps | grep "${1}:${2}" | sed 's/\s\+/ /g' | cut -d " " -f1)"
  
  if [ -n "${container_id}" ]
  then
    echo "Stopping container with ID '${container_id}'..."
    
    local error="$(docker stop "${container_id}" 2>&1 >/dev/null)"
    if [[ -z "${error}" ]]
    then
      echo "Removing container with ID '${container_id}'..."
      docker rm "${container_id}"
      echo "List of Docker's containers after removing '${docker_img_id}':"
      docker ps  
      return 0;
    else
      echo "Cannot stop a container with ID '${container_id}'."
      echo "${error}"
    fi
  else
    echo "Cannot found any container with name '${1}' of version '${2}'."
  fi
  
  return 1;
}

# Removing all trivial, non-attached images.
#
function removeDanglingImages {
  local image_ids="$(docker images -f "dangling=true" -q)"
  [ -n "${image_ids}" ] && docker rmi -f "${image_ids}"
}

# Removes given Docker's image which is tagged by a port number.
#
# Parameters:
# ${1} - Docker container's name to be removed,
# ${2} - Docker's port number to which it listens.
#
function removeImage() {
  echo "Attempting to remove '${1}:${2}' docker's image..."
  
  local docker_img_id="$(docker images | grep -E "${1}\s+${2}" | sed 's/\s\+/ /g' | cut -d " " -f3)"
  
  if [ -n "${docker_img_id}" ]
  then
    echo "Removing docker's image with ID '${docker_img_id}'..."
    
    local error="$(docker rmi "${docker_img_id}" -f 2>&1 >/dev/null)"
    if [[ -z "${error}" ]]
    then
      echo "Docker's image with ID '${docker_img_id}' was deleted."
      echo "List of Docker's images after removing '${docker_img_id}':"
      docker images
      return 0;
    else
      echo "Cannot remove docker's image with ID '${docker_img_id}'."
      echo "${error}"
    fi
  else
    echo "Cannot found any image with name '${1}' on port ${2}."
  fi
  
  return 1;
}

# Removes given Docker's image with given version.
#
# Parameters:
# ${1} - Docker container's name to be removed,
# ${2} - version of given container's name to be removed.
#
function removeCoreImage() {
  echo "Attempting to remove '${1}:${2}' docker's image..."
  
  local docker_img_id="$(docker images | grep -E "${1}\s+${2}" | sed 's/\s\+/ /g' | cut -d " " -f3)"
  
  if [ -n "${docker_img_id}" ]
  then
    echo "Removing docker's image with ID '${docker_img_id}'..."
    
    local error="$(docker rmi "${docker_img_id}" -f 2>&1 >/dev/null)"
    if [[ -z "${error}" ]]
    then
      echo "Docker's image with ID '${docker_img_id}' was deleted."
      echo "List of Docker's images after removing '${docker_img_id}':"
      docker images
      return 0;    
    else
      echo "Cannot remove docker's image with ID '${docker_img_id}'."
    fi
  else
    echo "Cannot found any image with name '${2}' of version '${2}'."
  fi
  
  return 1;
}

# Removes files/directories that are generated as output files/directories of this project.
#
function cleanDir() {
  echo "Attempting to remove output files/directories..."
  
  echo "Removing files generated by build bash script..."
  echo "Removing Docker related files..."
  [ -e "${DOCKERFILE_PATH}" ] && rm "${DOCKERFILE_PATH}"
  
  echo "Removing content of output directory for project..."
  [ -d jenkins_home ] && rm -fr jenkins_home
  
  echo "Project has been cleaned."
}

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
    
    if [ -n "${CODE_VERSION+x}" ]
    then
      echo "Image's version was defined by user so it won't be overwritten by configuration file."
    else
      CODE_VERSION="$(cat "${1}"  | grep "^ARG" | cut -d "=" -f2)"
      echo "Image's version read from configuration file: ${CODE_VERSION}."
    fi
    
    echo "Given values will be used:"
  else
    echo "No configuration for Docker's VM was found."
    echo -e "Default values will be used:"
  fi
  
  echo -e "\t- container's base image name: ${CONTAINER_NAME},"
  echo -e "\t- container's base image port: ${CONTAINER_PORT},"
  echo -e "\t- container's base image version: ${CODE_VERSION}."     
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
  # Firstly stop virtual machine that runs given Docker's image.
  closeContainer "${CONTAINER_NAME}" "${CONTAINER_PORT}"

  # Execute next step of this script if previously run function returns no error or force flag were set.
  if (( $? == 0 )) || ifForce
  then
    # Removing all trivial, non-attached images.
    removeDanglingImages
    # After virtual machine has been stopped, delete source image for given version.
    removeImage "${CONTAINER_NAME}" "${CONTAINER_PORT}"
    if (( $? == 0 )) || ifForce
    then
      # Then remove generic image (one without given version)
      removeCoreImage "${CONTAINER_NAME}" "${CODE_VERSION}"
      if (( $? == 0 )) || ifForce
      then
        # Remove files that are no longer needed.
        cleanDir
      fi
    fi
  fi
else
  printHelp
fi