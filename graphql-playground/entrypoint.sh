#!/bin/sh

# Debug: print the current value of the environment variable
echo "REACT_APP_GQL_URL is set to: ${REACT_APP_GQL_URL}"

echo "Replacing environment variables in env-config.js..."

# Use envsubst to replace the placeholders with actual environment variable values
envsubst < /usr/share/nginx/html/env-config.js > /usr/share/nginx/html/env-config.js.tmp && \
mv /usr/share/nginx/html/env-config.js.tmp /usr/share/nginx/html/env-config.js

# Debug: show the content of the final env-config.js file
cat /usr/share/nginx/html/env-config.js

# Start Nginx
echo "Starting Nginx..."
exec "$@"
