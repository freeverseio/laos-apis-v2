# Step 1: Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm ci

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Use a smaller, production-only image to serve the app
FROM nginx:stable-alpine

# Step 8: Copy the built app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Copy env-config.js to the public directory (to load environment variables at runtime)
COPY ./public/env-config.js /usr/share/nginx/html/env-config.js

# Step 10: Copy the entrypoint script
COPY ./entrypoint.sh /entrypoint.sh

# Step 11: Ensure the entrypoint script is executable
RUN chmod +x /entrypoint.sh

# Step 12: Expose the port Nginx will serve the app on
EXPOSE 80

# Step 13: Run the entrypoint script, which replaces environment variables in env-config.js and starts Nginx
ENTRYPOINT ["/entrypoint.sh"]

# Step 14: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
