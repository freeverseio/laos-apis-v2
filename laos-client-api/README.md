# LAOS Client API

## Overview

The **LAOS Client API** is a GraphQL service designed to facilitate write operations on the **LAOS blockchain**. It enables developers to perform actions such as minting and evolving assets, broadcasting transactions, and creating collections. This API serves as a crucial interface for interacting with the LAOS chain's state-modifying functionalities.

## Features

- **Mint Assets**: Create new assets on the LAOS blockchain.
- **Evolve Assets**: Update or transform existing assets.
- **Broadcast Transactions**: Submit transactions to the network.
- **Create Collections**: Organize assets into collections.
- **GraphQL Playground**: Interactive interface available at `/graphql` for testing mutations and queries.

## Installation

To set up and run the API locally, follow these steps:

```sh
# Clone the repository
git clone https://github.com/freeverseio/laos-apis-v2.git

# Navigate to the client API directory
cd laos-apis-v2/laos-client-api

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

| Variable         | Description                           |
|------------------|---------------------------------------|
| `PORT`           | The port on which the API runs.       |
| `DB_URI`         | Database connection string.           |
| `LAOS_RPC_URL`   | RPC URL of the LAOS blockchain node.  |
| `API_KEY`        | API key for authenticating requests.  |

## GraphQL Playground

Access the **GraphQL Playground** interface at:

```
http://localhost:<PORT>/graphql
```

This interactive tool allows you to construct and test GraphQL mutations and queries.

## Example GraphQL Mutations

### Mint Asset

```graphql
mutation {
  mintAsset(input: {
    owner: "0xabc123...",
    metadata: {
      name: "Unique Asset",
      description: "An exclusive asset on LAOS",
      attributes: [
        { key: "rarity", value: "legendary" },
        { key: "power", value: "9001" }
      ]
    }
  }) {
    assetId
    status
  }
}
```

### Evolve Asset

```graphql
mutation {
  evolveAsset(input: {
    assetId: "123",
    newMetadata: {
      power: "9500"
    }
  }) {
    assetId
    status
  }
}
```

### Broadcast Transaction

```graphql
mutation {
  broadcastTransaction(input: {
    signedTx: "0xSignedTransactionData..."
  }) {
    transactionHash
    status
  }
}
```

### Create Collection

```graphql
mutation {
  createCollection(input: {
    name: "Exclusive Art Collection",
    description: "A collection of exclusive digital art pieces.",
    creator: "0xcreatorAddress..."
  }) {
    collectionId
    status
  }
}
```

## Running Tests

To execute tests, run:

```sh
npm test
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

---

*Note: Ensure that your environment variables are correctly configured before starting the API. The GraphQL Playground provides an intuitive interface for testing and interacting with the API's capabilities.* 