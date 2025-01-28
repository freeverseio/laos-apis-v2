# Base node image
FROM node:16-alpine AS node

# Add necessary build tools
FROM node AS node-with-gyp
RUN apk add g++ make python3

# Step 1: Install dependencies and prepare the builder
FROM node-with-gyp AS builder
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
ADD db db
RUN npm ci

# Step 2: Install subsquid CLI globally
RUN npm i -g @subsquid/commands && mv $(which squid-commands) /usr/local/bin/sqd

# Step 3: Add the rest of the files, generate schema, and create TypeORM entities
ADD schema.graphql.template .
ADD generateSchema.js .
ADD commands.json .
ADD src src
ADD tsconfig.json .

ARG CHAIN_NAME="Polygon"
ENV CHAIN_NAME=${CHAIN_NAME}
# Print the value of CHAIN_NAME for debugging
RUN echo "CHAIN_NAME is set to: $CHAIN_NAME"

# Run the schema generation command
RUN node generateSchema.js --chainName=$CHAIN_NAME

RUN sqd codegen

# Step 4: Build the project
RUN npm run build

# Step 5: Install production dependencies
FROM node-with-gyp AS deps
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
RUN npm ci --production

# Final stage: Copy artifacts to the final image
FROM node AS squid
WORKDIR /squid
COPY --from=deps /squid/package.json .
COPY --from=deps /squid/package-lock.json .
COPY --from=deps /squid/node_modules node_modules
COPY --from=builder /squid/lib lib
COPY --from=builder /squid/db db
COPY --from=builder /squid/schema.graphql schema.graphql
ADD commands.json .
RUN echo -e "loglevel=silent\\nupdate-notifier=false" > /squid/.npmrc
RUN npm i -g @subsquid/commands && mv $(which squid-commands) /usr/local/bin/sqd
ENV PROCESSOR_PROMETHEUS_PORT 3000