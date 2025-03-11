# LAOS Indexer API

## Overview
The **LAOS Indexer API** is a GraphQL service that allows querying asset indexes on the **LAOS blockchain** and its sibling collections on **EVM-compatible chains** like Polygon. This API enables efficient retrieval of asset-related data, ensuring seamless integration with dApps and blockchain-based applications.

## Features
- Query asset indexes on LAOS and EVM-compatible chains.
- Fetch metadata and ownership details of assets.
- Support for pagination and filtering for efficient data retrieval.
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

