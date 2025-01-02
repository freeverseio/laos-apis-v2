# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base as deps
WORKDIR /app

# Install required packages for building native dependencies
RUN apk add --no-cache libc6-compat g++ make python3 curl
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy the rest of the application code
COPY . .

ENV ROOT_DIR=/app
ENV POLYGON_INDEXER_GRAPHQL_ENDPOINT=http://indexer-laos-polygon-api-for-gateway.protostar.svc.cluster.local:4000/graphql
ENV ETHEREUM_INDEXER_GRAPHQL_ENDPOINT=http://indexer-laos-ethereum-api-for-gateway.protostar.svc.cluster.local:4000/graphql
ENV HEDERA_INDEXER_GRAPHQL_ENDPOINT=http://indexer-laos-hedera-api-for-gateway.protostar.svc.cluster.local:4000/graphql
ENV API_GRAPHQL_ENDPOINT=http://laos-client-api-for-gateway.protostar.svc.cluster.local:4001/

# Build the TypeScript code
RUN npm run build

# Remove development dependencies and build tools to save space
RUN apk del g++ make python3

# Set the environment to production
ENV NODE_ENV=production

# Expose the port your app runs on (if needed)
EXPOSE 4000

# Command to start the GraphQL Mesh gateway
CMD ["npm", "start"]
