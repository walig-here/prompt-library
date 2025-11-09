FROM ubuntu:22.04

ENV DISPLAY=":1"
ENV LOGS_DIR="/home/workspace/logs"
ENV VNC_PORT="5901"
ENV APP_ROOT="/home/workspace/prompt-library"
ENV SCRIPTS_DIR="/home/workspace/scripts"
ENV DBUS_SESSION_ADDRESS_FILE="/tmp/dbus/addresses.env"
ENV DEV_SERVER_PIPE="/tmp/dev-server-pipe"

SHELL [ "/bin/bash", "-c" ]
RUN mkdir /home/workspace
WORKDIR /home/workspace

RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install curl -y

RUN curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y \
    nodejs \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2  \
    libcairo2 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    x11vnc \
    xvfb \
    websockify \
    novnc \
    git \
    dpkg \
    fakeroot \
    rpm \
    vim \
    build-essential \
    clang \
    libdbus-1-dev \
    libgtk-3-dev \
    libnotify-dev \
    libasound2-dev \
    libcap-dev \
    libcups2-dev \
    libxtst-dev \
    libxss1 \
    libnss3-dev \
    gcc-multilib \
    g++-multilib  \
    gperf \
    bison \
    python3-dbusmock \
    openjdk-8-jre \
    fluxbox
RUN npm install -g typescript

RUN useradd 'ci'
