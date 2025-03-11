# LAOS Indexers and APIs

The **LAOS APIs** repository consolidates the tools and components for interacting with the LAOS blockchain. This includes indexing, client APIs, and a GraphQL gateway to manage queries and mutations efficiently.

It consists of 3 main components:

* The [**Minimal LAOS Indexer**](./minimal-indexer.md) that enables the indexing of Bridgelessly Minted NFTs on multiple chains. It uses an efficient topology where multiple fully-independent indexers can be run (LAOS Mainnet, LAOS Testnet, Ethereum, Polygon, ...), and the merging of their data is performed only at the [API level](./laos-indexer-api/). Please consult the [Minimal LAOS Indexer README](./minimal-indexer.md) for full information.

* The [LAOS Client API](./laos-client-api/) is a GraphQL service, on top of the Minimal LAOS indexer, designed to facilitate write operations required for Bridgeless Minting. It enables developers to perform actions such as minting and evolving assets, broadcasting transactions, and creating collections. This API serves as a crucial interface for interacting with the LAOS chain's state-modifying functionalities.

* The [Bitcoin-LAOS Indexer](./laos-indexer-btc-api/) used to scale Bitcoin NFT minting and evolution via LAOS Bridgeless Minting.


## License
This project is licensed under the MIT License. 