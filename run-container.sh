#! /bin/bash
IMAGE_BUILD_ERROR=101
INVALID_ARGS_ERROR=255
CONTAINER_NAME="prompt-library"
BRANCH_NAME="$(git branch --show-current)"
if [ "${BRANCH_NAME}" == "main" ]; then
    IMAGE_NAME="walig/prompt-library:latest"
else
    IMAGE_NAME="walig/prompt-library:${BRANCH_NAME}"
fi
IMAGE_ID=$(docker images --filter=reference="${IMAGE_NAME}" -q)


function print_help() {
cat <<EOF
Builder for project's Docker image. Also invoker for project's Docker container.

Usage:
    docker.sh           Rebuild image and run container.
    docker.sh --run     Run existing container.
    docker.sh --help    Show this manual.

Exit codes:
    0                   Success
    101                 Image build error
    255                 Invalid arguments
EOF
}


function build_image() {
    docker build . -t ${IMAGE_NAME}
    BUILD_RETCODE=$?
    if [ ${BUILD_RETCODE} -ne 0 ]; then
        echo "Can't create image '${IMAGE_NAME}'! Return code: ${BUILD_RETCODE}" 
        exit ${IMAGE_BUILD_ERROR} 
    fi
}

# Main flow

if (( $# >= 1 )) && [ $1 != "--run" ]; then
    print_help
    exit ${INVALID_ARGS_ERROR} 
fi

OLD_CONTAINER_ID=$(docker ps -aq --filter=name=${CONTAINER_NAME})
if (( $# == 0 )) || [ -z ${OLD_CONTAINER_ID} ]; then
    if [ ! -z ${OLD_CONTAINER_ID} ]; then
        echo "Old container found! It would be removed."
        docker rm ${OLD_CONTAINER_ID} -f
    fi
    if [ ! -z ${IMAGE_ID} ]; then
        echo "Old '${IMAGE_NAME}' image found! It would be deleted."
        docker rmi ${IMAGE_ID}
    fi

    docker pull "${IMAGE_NAME}" || build_image
fi
IMAGE_ID=$(docker images --filter=reference=${IMAGE_NAME} -q)
echo "Image '${IMAGE_NAME}' found with id '${IMAGE_ID}'"

if (( $# == 0 )) || [ -z ${OLD_CONTAINER_ID} ]; then
    docker run -v="$(pwd):/home/workspace" -p=6800:6800 --name ${CONTAINER_NAME} -it ${IMAGE_NAME} "/bin/bash" 
else
    docker start ${CONTAINER_NAME} -i
fi
