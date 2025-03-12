# LAOS EVM Ownership Indexer

This code provides an indexer that tracks all NFT transfers on any EVM chain. 
Within the umbrella of LAOS Bridgeless Minting, at least one ownership indexer is needed alongside an instance of at least one indexer of a LAOS Network (mainnet or testnet), which can be found [here](../laos-indexer/). Please refer to the [LAOS Indexer Bridgeless Minting README](../bridgeless-minting-indexer.md) for further context.

The code is a minimal extension of Subsquid's framework, leveraging its multi-chain indexing feature to track events on both the EVM chain and the LAOS Network.

A custom GraphQL API is provided for real-time data retrieval.

## Setting up

1. **Specify the EVM ownership chain** where transfers and other ownership-related transactions will take place, e.g. Ethereum, Polygon, by creating an `.env` file.
   - Use `example.env` as a reference.
   - Provide the appropriate ownership chain RPC endpoint, e.g. `RPC_ENDPOINT=https://rpc.ankr.com/polygon`.
   - Select the block at which the indexer will start processing events in that chain, e.g. `STARTING_BLOCK_OWNERSHIP=59600000`.
   - adapt the following env variables by setting the string (e.g. `Ethereum`) in the right places, e.g.:
     - `CHAIN_NAME=Ethereum`
     - `OWNERSHIP_CONTRACT_MODEL=EthereumOwnershipContract`
     - `ASSET_MODEL=EthereumAsset`
     - `TRANSFER_MODEL=EthereumTransfer`
     - `SCHEMA_NAME=ownership_chain_ethereum_processor`

Note: Public RPC endpoints often have transaction limits.

2. **Quickstart** Execute the following commands:

```bash
# 1. Install @subsquid/cli globally (sqd command)
npm i -g @subsquid/cli@2.12.x

# 2. Install dependencies
npm ci

# 3. Clean previous processes
sqd clean:all

# 4. Build and start the processor
sqd run .
```

A GraphQL playground will be available at http://localhost:4351/graphql.


3. **Generate the schema.graphql file**

```bash
sqd generate:schema
```
or
```bash
node generateSchema.js --chainName=Polygon
```

4. **Build ORM entities**

```bash
sqd codegen
sqd clean:all
```


5. **Move migration file**

```bash
mv db/migrations/* migrations/db/migrations/
```

6. **Go to the migrations folder and run migrations**

```bash
cd migrations
npx ts-node db/migrations/index.ts
```

7. **Start the processor**

```bash
sqd run .
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or new features.

## License
This project is licensed under the MIT License. 