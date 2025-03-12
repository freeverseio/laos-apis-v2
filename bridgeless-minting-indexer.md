# LAOS Bridgeless Minting Indexer

An example of a minimal deployed Bridgeless-Minting indexer, currently operating on Ethereum, Polygon and both LAOS Mainnet and Testnet, can be found [here](https://indexers.laosnetwork.io/). 

A minimal LAOS Bridgeless Minting Indexer consists of:
* An indexer for [LAOS Mainnet](https://chainlist.org/chain/6283) and optionally for [LAOS Sigma Testnet](https://chainlist.org/chain/62850).
* Any number of indexers for EVM *ownership* chains (Ethereum, Polygon, etc.) to be scaled via Bridgeless Minting.

The following folders are relevant:
- [laos-indexer](./laos-indexer): core service that indexes LAOS Mainnet and LAOS Testnet.
- [laos-ownership-indexer](./laos-ownership-indexer): core service that indexes each of the EVM Ownership chains.
- [laos-indexer-api](./laos-indexer-api): which exposes a GraphQL API that conveniently fuses information from both types of indexers. For example, it provides a user's inventory by checking mints on LAOS and transfers on the ownership chains.
- [laos-extensions](./laos-extensions): which routes custom queries used by 3rd parties, such as `GetTokenBalances` and `TotalSupply`, to the corresponding queries exposed by the indexer API.

## Setting up

1. Add a LAOS Mainnet indexer, and optionally a LAOS Testnet indexer, by following the corresponding [README](./laos-indexer/README.md) 

2. Add as many EVM ownership indexers as desired, by following the corresponding [README](./laos-ownership-indexer/README.md) 

3. Set up the fusing API, by following the corresponding [README](./laos-indexer-api/README.md) 

4. If needed, follow the [LAOS extensions README](./laos-extensions/README.md) 
