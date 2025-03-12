# LAOS Bridgeless Minting Indexer API

## Overview

The **LAOS Bridgeless Minting API** is a GraphQL service that returns all required information regarding Bridgelessly Minted assets, by conveniently fusing information from all underlying indexers (LAOS plus multiple EVM ownership chains, like Ethereum and Polygon). For example, it provides a user's inventory by checking mints (and evolves) on LAOS and transfers on the ownership chains.

Please refer to the [LAOS Indexer Bridgeless Minting README](../bridgeless-minting-indexer.md) for further context.

## Features
- Query assets indexed on LAOS and EVM-compatible chains.
- Fetch metadata and ownership details of assets.
- Supports pagination and filtering to optimize data retrieval.
- Optimized for performance and scalability.
- GraphQL Playground available at `/graphql` for testing queries.

## Installation
To set up and run the API locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/freeverseio/laos-apis-v2.git

# Navigate to the indexer API directory
cd laos-apis-v2/laos-indexer-api

# Install dependencies
npm ci

# Configure environment variables
cp .env.example .env

# Update the .env file with appropriate values

# Start the API
npm start
```

## Environment Variables
The API requires the following environment variables to be set:

| Variable            | Description                        |
|---------------------|----------------------------------|
| `GQL_PORT`         | The port on which the API runs.  |
| `DATABASE_URL`           | Database connection string.      |


## GraphQL Playground
The API provides a **GraphQL Playground** interface at:

```
http://localhost:<GQL_PORT>/graphql
```

Use this interactive tool to explore queries and test API endpoints.

## Example GraphQL Queries

### Get Asset by ID
```graphql
query Asset {
  token(
    chainId: "137"
    tokenId: "53919893334301279589396318239190294297714481641109014155142484029476"
    contractAddress: "0x1b4d230bcc0e72f4f8adacf7c0ad5c389f289b04"
  ) {
    tokenUri
    name
    description
  }
} 
```

### Search Assets
```graphql
query Assets {
  tokens(where: {chainId: "137"}) {
    totalCount
    edges {
      node {
        attributes
        name
      }
    }
  }
}
```



## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Submit a pull request.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact
For support or inquiries, reach out via [GitHub Issues](https://github.com/freeverseio/laos-apis-v2/issues).

