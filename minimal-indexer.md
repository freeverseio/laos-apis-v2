# Deploy of a Minimal Indexer

An example of deployed indexer, currently operating on Ethereum, Polygon and both LAOS Mainnet and Testnet, can be found [here](https://indexers.laosnetwork.io/). 

A minimal LAOS Indexer contains:
* An indexer of [LAOS Mainnet](https://chainlist.org/chain/6283) and, optionally, an indexer of [LAOS Sigma Testnet](https://chainlist.org/chain/62850).
* Any number of indexers of EVM *ownership* chains (Ethereum, Polygon, etc.) to be scaled via Bridgeless Minting.

Correspondingly, the following are relevant:
- [laos-indexer](./laos-indexer): core service that indexes LAOS Mainnet and LAOS Testnet.
- [laos-ownership-indexer](./laos-ownership-indexer): core service that indexes each of the EVM Ownership chains.
- [laos-indexer-api](./laos-indexer-api): which exposes a graphQL API that conveniently fuses information from both types of indexers. For example, it provides a user's inventory by consulting mints on LAOS and transfers on the ownership chains.
- [laos-extentions](./laos-extentions): which routes custom queries used by 3rd parties, such as `GetTokenBalances` and `TotalSupply`, to the corresponding queries exposed by the indexer API.

## Setting up

1. Add a LAOS Mainnet indexer, and optionally a LAOS Testnet indexer, by following the corresponding [README](./laos-indexer/README.md) 

2. Add as many EVM ownership indexers as desired, by following the corresponding [README](./laos-ownership-indexer/README.md) 

3. Setup the fusing API, by following the corresponding [README](./laos-indexer-api/README.md) 

4. If needed, follow the [extensions README](./laos-extentions/README.md) 
