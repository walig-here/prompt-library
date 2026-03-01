set -e
mkfifo ${DEV_SERVER_PIPE}
"${SCRIPTS_DIR}/run-dev-services.sh" &

cd ${APP_ROOT}
if [ ! -d "${APP_ROOT}/node_modules" ]; then
    npm install
fi

echo "Waiting for services..."
read < ${DEV_SERVER_PIPE}
rm ${DEV_SERVER_PIPE}
echo "Serivces ready!"
. ${DBUS_SESSION_ADDRESS_FILE}

npm run dev
