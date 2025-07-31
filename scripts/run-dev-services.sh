#! /bin/bash
set -e

# Teardown
function teardown {
    echo "Terminating all services"
    kill ${CLIENT_PID} > /dev/null 2>&1 || true
    kill ${VNC_PID}  > /dev/null 2>&1 || true
    kill ${VIRTUAL_DISPLAY_PID}  > /dev/null 2>&1 || true
    kill ${WIN_MANAGER_PID} > /dev/null 2>&1 || true
    kill ${DBUS_PID}  > /dev/null 2>&1 || true
    kill ${DBUS_SESSION_BUS_PID} > /dev/null 2>&1 || true
    if [ -f ${DBUS_SESSION_ADDRESS_FILE} ]; then
        rm ${DBUS_SESSION_ADDRESS_FILE}
    fi
    exit 0
}
trap teardown SIGTERM SIGINT EXIT

if [ ! -d ${LOGS_DIR} ]; then
    mkdir ${LOGS_DIR}
else
    rm -rf ${LOGS_DIR}/*
fi

# DBus
mkdir -p "/run/dbus"
if [ -f "/run/dbus/pid" ]; then
    rm -f "/run/dbus/pid"
fi
DBUS_ADDRESS_FILE_PARENT=$(dirname ${DBUS_SESSION_ADDRESS_FILE})
mkdir -p ${DBUS_ADDRESS_FILE_PARENT}

SYSTEM_DBUS_DATA=$(dbus-daemon --system --fork --print-pid --print-address)
SYSTEM_DBUS_DATA=(${SYSTEM_DBUS_DATA// /})
DBUS_PID=${SYSTEM_DBUS_DATA[1]}
DBUS_SYSTEM_BUS_ADDRESS=${SYSTEM_DBUS_DATA[0]}
echo "Started system DBus daemon on PID ${DBUS_PID}"

eval $(dbus-launch --sh-syntax)
echo "Started session D-Bus daemon on PID ${DBUS_SESSION_BUS_PID} with address ${DBUS_SESSION_BUS_ADDRESS}"

cat >> ${DBUS_SESSION_ADDRESS_FILE} <<EOF
export DBUS_SESSION_BUS_ADDRESS='${DBUS_SESSION_BUS_ADDRESS}'
export DBUS_SYSTEM_BUS_ADDRESS='${DBUS_SYSTEM_BUS_ADDRESS}'
EOF
chmod +x ${DBUS_SESSION_ADDRESS_FILE}

# Virtual display
if [ -f "/tmp/.X1-lock" ]; then
    rm /tmp/.X1-lock
fi
Xvfb ${DISPLAY} -screen 0 1440x810x24 -ac +extension GLX +render -noreset > "${LOGS_DIR}/virtual-frame-buffer.log" 2>&1 &
VIRTUAL_DISPLAY_PID=$!
echo "Started virtual display on PID ${VIRTUAL_DISPLAY_PID}"

# Fluxbox window manager
fluxbox > "${LOGS_DIR}/window-manager.log" 2>&1 &
WIN_MANAGER_PID=$!
echo "Started window manager on PID ${WIN_MANAGER_PID}"

# VNC server
x11vnc -forever -create -shared -rfbport ${VNC_PORT} -display "${DISPLAY}" > "${LOGS_DIR}/vnc-server.log" 2>&1 &
VNC_PID=$!
echo "Started VNC server on PID ${VNC_PID}"

# VNC web client and proxy
websockify --web=/usr/share/novnc/ 6800 localhost:${VNC_PORT} > "${LOGS_DIR}/vnc-client.log" 2>&1 &
CLIENT_PID=$!
echo "Started VNC client on PID ${CLIENT_PID} and http://localhost:6800/vnc.html"

echo 'ready' > ${DEV_SERVER_PIPE}
wait
exit 1
