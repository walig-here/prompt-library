#! /bin/bash
IMAGE_BUILD_ERROR=101
INVALID_ARGS_ERROR=255
IMAGE_TAG="prompt-library"
IMAGE_ID=$(docker images --filter=reference="${IMAGE_TAG}" -q)


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
    if [ ! -z ${OLD_CONTAINER_ID} ]; then
        echo "Old container found! It would be removed."
        docker rm ${OLD_CONTAINER_ID} -f
    fi
    if [ ! -z ${IMAGE_ID} ]; then
        echo "Old '${IMAGE_TAG}' image found! It would be deleted."
        docker rmi ${IMAGE_ID}
    fi

    docker build . -t ${IMAGE_TAG}
    BUILD_RETCODE=$?
    if [ ${BUILD_RETCODE} -ne 0 ]; then
        echo "Can't create image '${IMAGE_TAG}'! Return code: ${BUILD_RETCODE}" 
        exit ${IMAGE_BUILD_ERROR} 
    fi
}

# Main flow

if (( $# >= 1 )) && [ $1 != "--run" ]; then
    print_help
    exit ${INVALID_ARGS_ERROR} 
fi

OLD_CONTAINER_ID=$(docker ps -aq --filter=name=${IMAGE_TAG})
if (( $# == 0 )) || [ -z ${OLD_CONTAINER_ID} ]; then
    build_image
fi
IMAGE_ID=$(docker images --filter=reference=${IMAGE_TAG} -q)
echo "Image '${IMAGE_TAG}' found with id '${IMAGE_ID}'"

if (( $# == 0 )) || [ -z ${OLD_CONTAINER_ID} ]; then
    docker run -v="$(pwd):/home/workspace" -p=6800:6800 --name ${IMAGE_TAG} -it ${IMAGE_TAG} "/bin/bash" 
else
    docker start ${IMAGE_TAG} -i
fi
