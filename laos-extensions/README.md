# LAOS Extensions

## Overview
The **LAOS Extensions** is a simple compoment that routes custom queries used by 3rd parties, such as `GetTokenBalances` and `TotalSupply`, to the corresponding queries exposed by the indexer API.

## Installation
To set up and run the API locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/freeverseio/laos-apis-v2.git

# Navigate to the indexer API directory
cd laos-apis-v2/laos-extensions

# Install dependencies
npm ci

# Start the API
npm start
```